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

  return redirect("/trips");
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

  return {
    ...profile,
    email_verified: user.user.user_metadata.email_verified,
  };
};

export const updateUserEmailAction = async (email: string) => {
  const supabase = await createClient();
  const { data: user, error } = await supabase.auth.updateUser({
    email: email,
  });

  if (error || !user) {
    console.error(error?.message || "User not found");
    return encodedRedirect(
      "error",
      "/sign-in",
      "Failed to fetch user information"
    );
  }

  if (error) {
    return { success: false, error: "Failed to update user's email" };
  }

  return { success: true, message: "User's email updated successfully" };
};

export const updateUserDataAction = async (formData: {
  name: string;
  surname: string;
  companyName: string;
  cif: string;
}) => {
  const nombre = formData.name;
  const apellidos = formData.surname;
  const empresa = formData.companyName;

  const supabase = await createClient();
  const { data: user, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error(error?.message || "User not found");
    return { success: false, error: "Failed to fetch user information" };
  }

  const updateFields: any = {};

  if (nombre) updateFields.nombre = nombre;
  if (apellidos) updateFields.apellidos = apellidos;
  if (empresa) updateFields.empresa = empresa;

  const { error: updateError } =
    Object.keys(updateFields).length > 0
      ? await supabase
          .from("profiles")
          .update(updateFields)
          .eq("id", user.user.id)
      : { error: null };

  if (updateError) {
    return { success: false, error: "Failed to update profile" };
  }

  return { success: true, message: "Profile updated successfully" };
};

export const deleteUserAction = async () => {
  // TODO
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

export const removeTripAction = async (tripId: string) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not authenticated");
    return { error: "User not authenticated" };
  }

  const { data: trip, error: tripError } = await supabase
    .from("viajes")
    .select("*")
    .eq("id", tripId)
    .eq("usuario_id", user.id)
    .single();

  if (tripError || !trip) {
    console.error("Trip not found or unauthorized");
    return { error: "Trip not found or unauthorized" };
  }

  const { error: deleteError } = await supabase
    .from("viajes")
    .delete()
    .eq("id", tripId);

  if (deleteError) {
    console.error(deleteError.code + " " + deleteError.message);
    return { error: deleteError.message };
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

export const getNumberOfUserTripsAction = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { count: 0, trips: [] };
  }

  const {
    data: trips,
    count,
    error,
  } = await supabase
    .from("viajes")
    .select("*, localizaciones (*)", { count: "exact" })
    .eq("usuario_id", user.id);

  if (error) {
    console.error("Error fetching trips and count:", error);
    return { count: 0, trips: [] };
  }

  // Transform the data to match the expected structure
  const transformedTrips = trips.map((trip) => ({
    ...trip,
    localizacion: trip.localizaciones,
  }));

  return { count: count || 0, trips: transformedTrips };
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

export const createExpenseAction = async (expenseData: {
  amount: number;
  currency: string;
  type: string;
  businessName: string;
  taxId: string;
  viajeId: string;
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

  const { data: existingBusiness, error: businessError } = await supabase
    .from("comercios")
    .select("id")
    .eq("cuit_rfc_nit", expenseData.taxId)
    .single();

  let businessId;

  if (businessError && !existingBusiness) {
    const { data: newBusiness, error: createBusinessError } = await supabase
      .from("comercios")
      .insert([
        {
          nombre: expenseData.businessName,
          cuit_rfc_nit: expenseData.taxId,
        },
      ])
      .select()
      .single();

    if (createBusinessError) {
      console.error("Error creating business:", createBusinessError);
      return { error: "Failed to create business" };
    }

    businessId = newBusiness.id;
  } else {
    businessId = existingBusiness.id;
  }

  const { data, error } = await supabase
    .from("gastos")
    .insert([
      {
        viaje_id: expenseData.viajeId,
        monto_total: expenseData.amount,
        moneda: expenseData.currency,
        usuario_id: user.id,
        categoria: expenseData.type,
        comercio_id: businessId,
      },
    ])
    .select();

  if (error) {
    console.error("Error creating expense:", error);
    return { error: "Failed to create expense" };
  }

  return { success: true };
};

export const getTripExpenses = async (tripId: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: expenses, error } = await supabase
    .from("gastos")
    .select(
      `
      *,
      comercios (
        nombre,
        cuit_rfc_nit
      )
    `
    )
    .eq("viaje_id", tripId);

  if (error) {
    console.error("Error fetching trips:", error);
    return [];
  }

  return expenses;
};

export const createNoteAction = async (
  content: JSON | undefined,
  tripId: string
) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not authenticated");
    return { error: "User not authenticated" };
  }

  const { data: existingNote, error: checkError } = await supabase
    .from("notas")
    .select()
    .eq("viaje_id", tripId)
    .single();

  if (checkError?.code !== "PGRST116") {
    // PGRST116 means no rows returned
    if (existingNote) {
      console.log(existingNote.contenido);
      return existingNote;
    }
    if (checkError) {
      console.error("Error checking existing note:", checkError);
      return { error: "Failed to check existing note" };
    }
  }

  const { data, error: insertError } = await supabase
    .from("notas")
    .insert([
      {
        viaje_id: tripId,
        usuario_id: user.id,
        contenido: content,
      },
    ])
    .select();

  if (insertError) {
    console.error("Error creating note:", insertError);
    return { error: "Failed to create note" };
  }

  return data[0];
};

export const updateNoteAction = async (
  noteId: string | null,
  content: JSON
) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not authenticated");
    return { error: "User not authenticated" };
  }
  console.log("noteId", noteId);
  const { data, error: updateError } = await supabase
    .from("notas")
    .update({
      contenido: content,
      temp: "prueba",
    })
    .eq("id", noteId)
    .select();

  if (updateError) {
    console.error("Error updating note:", updateError);
    return { error: "Failed to update note" };
  }

  return { success: true, data };
};

export const deleteNoteAction = async (noteId: string) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not authenticated");
    return { error: "User not authenticated" };
  }

  const { error: deleteError } = await supabase
    .from("notas")
    .delete()
    .eq("id", noteId);

  if (deleteError) {
    console.error("Error deleting note:", deleteError);
    return { error: "Failed to delete note" };
  }

  return { success: true };
};

export const getTripNotes = async (tripId: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: notes, error } = await supabase
    .from("notas")
    .select()
    .eq("viaje_id", tripId);

  if (error) {
    console.error("Error fetching notes:", error);
    return [];
  }

  return notes;
};
