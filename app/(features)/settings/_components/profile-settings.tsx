"use client";

import ProfileForm, { ProfileFormData } from "./profile-form";
import EmailForm, { EmailFormData } from "./email-form";
import { updateUserDataAction, updateUserEmailAction } from "@/app/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

interface ProfileSettingsProps {
  user: {
    nombre?: string;
    apellidos?: string;
    email?: string;
    empresa?: string;
    email_verified?: string | null; // Add this field to track verification status
  };
}

export default function ProfileSettings({ user }: ProfileSettingsProps) {
  const router = useRouter();

  const handleProfileSubmit = async (data: ProfileFormData) => {
    try {
      const result = await updateUserDataAction(data);

      if (result.success) {
        toast.success(
          "Your profile information has been successfully updated."
        );
        router.refresh();
        return true;
      } else {
        toast.error(result.error || "Failed to update profile");
        return false;
      }
    } catch (error) {
      toast.error(
        "There was a problem updating your profile. Please try again."
      );
      return false;
    }
  };

  const handleEmailSubmit = async (data: EmailFormData) => {
    try {
      const result = await updateUserEmailAction(data.email);
      if (result.success) {
        toast.success(
          "Verification email sent. Please check your inbox to confirm your new email address."
        );
        router.refresh();
        return true;
      } else {
        toast.error(result.error || "Failed to update email");
        return false;
      }
    } catch (error) {
      toast.error("There was a problem updating your email. Please try again.");
      return false;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <ProfileForm
        user={user}
        onSubmit={async (data) => {
          return await handleProfileSubmit(data);
        }}
      />
      <EmailForm
        user={user}
        isVerified={!!user.email_verified}
        onSubmit={async (data) => {
          return await handleEmailSubmit(data);
        }}
      />
    </div>
  );
}
