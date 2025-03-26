"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const nombre = formData.get("nombre")?.toString();
  const apellido = formData.get("apellidos")?.toString();

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }

  if (!nombre || !apellido) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Nombre, Apellido son requeridos"
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        nombre: nombre,
        apellidos: apellido,
      },
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/home");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/home/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/home/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect("error", "/home/reset-password", "Passwords do not match");
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect("error", "/home/reset-password", "Password update failed");
  }

  encodedRedirect("success", "/home/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
};

export const getUserDataAction = async () => {
  const supabase = await createClient();
  const { data: user, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error(error?.message || "User not found");
    return encodedRedirect(
      "error",
      "/sign-in",
      "Failed to fetch user information"
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.user.id)
    .single();

  if (profileError) {
    console.error(profileError.message);
    return encodedRedirect("error", "/", "Failed to fetch user profile");
  }

  return profile;
};

export const createTripAction = async (tripData: {
  name: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  description: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
}) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not authenticated");
    return { error: "User not authenticated" };
  }

  const { data: existingLocation, error: locationError } = await supabase
    .from("localizaciones")
    .select("id")
    .eq("nombre", tripData.location.name)
    .single();

  let locationId;

  if (locationError && !existingLocation) {
    const { data: newLocation, error: createLocationError } = await supabase
      .from("localizaciones")
      .insert([
        {
          nombre: tripData.location.name,
          latitud: tripData.location.latitude,
          longitud: tripData.location.longitude,
        },
      ])
      .select()
      .single();

    if (createLocationError) {
      console.error("Error creating location:", createLocationError);
      return { error: "Failed to create location" };
    }

    locationId = newLocation.id;
  } else {
    locationId = existingLocation.id;
  }

  const { data: trip, error } = await supabase.from("viajes").insert([
    {
      nombre: tripData.name,
      fecha_inicio: tripData.startDate,
      fecha_fin: tripData.endDate,
      descripcion: tripData.description,
      usuario_id: user.id,
      localizacion_id: locationId,
    },
  ]);
  if (error) {
    console.error(error.code + " " + error.message);
    return { error: error.message };
  }

  return { success: true };
};

export const getUserTripsAction = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: trips, error } = await supabase
    .from("viajes")
    .select(
      `
      *,
      localizaciones (
        id,
        nombre,
        latitud,
        longitud
      )
    `
    )
    .eq("usuario_id", user.id);

  if (error) {
    console.error("Error fetching trips:", error);
    return [];
  }

  // Transform the data to match the expected structure
  const transformedTrips = trips.map((trip) => ({
    ...trip,
    localizacion: trip.localizaciones,
  }));

  return transformedTrips;
};

export const getTripAction = async (tripId: string) => {
  const supabase = await createClient();
  const { data: trip, error } = await supabase
    .from("viajes")
    .select(
      `
      *,
      localizaciones (
        id,
        nombre,
        latitud,
        longitud
      )
    `
    )
    .eq("id", tripId)
    .single();
  if (error) {
    console.error("Error fetching trip:", error);
    return null;
  }
  const transformedTrip = {
    ...trip,
    localizacion: trip.localizaciones,
  };
  return transformedTrip;
};
