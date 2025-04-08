"use client";

import { Button } from "@/components/ui/button";
import { useState, FormEvent, ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ProfileFormProps {
  user: {
    nombre?: string;
    apellidos?: string;
    empresa?: string;
  };
  onSubmit?: (data: ProfileFormData) => Promise<boolean | void>;
}

export interface ProfileFormData {
  name: string;
  surname: string;
  companyName: string;
  cif: string;
}

const inputClassName =
  "mt-1 block w-full rounded-md border-2 border-gray-300 p-2 focus:border-gray-300";
const labelClassName = "block text-sm font-medium text-gray-700";

export default function ProfileForm({ user, onSubmit }: ProfileFormProps) {
  const [profileData, setProfileData] = useState<ProfileFormData>({
    name: "",
    surname: "",
    companyName: "",
    cif: "",
  });
  const [isProfileDirty, setIsProfileDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const hasValues = Object.values({ ...profileData, [name]: value }).some(
      (val) => val.trim() !== ""
    );
    setIsProfileDirty(hasValues);
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;

    setIsSubmitting(true);
    try {
      const result = await onSubmit(profileData);

      if (result === true) {
        handleProfileCancel();
      }
    } catch (error) {
      console.error("Error submitting profile data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileCancel = () => {
    setProfileData({
      name: "",
      surname: "",
      companyName: "",
      cif: "",
    });
    setIsProfileDirty(false);
  };

  return (
    <motion.div
      className="border rounded-lg p-8"
      style={{ minHeight: isProfileDirty ? "auto" : "auto" }}
      animate={{
        borderColor: isProfileDirty ? "var(--accent)" : "",
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <form className="space-y-4" onSubmit={handleProfileSubmit}>
        <div className="flex flex-row gap-2 w-full">
          <div className="flex-1">
            <label htmlFor="name" className={labelClassName}>
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder={user.nombre}
              className={inputClassName}
              value={profileData.name}
              onChange={handleProfileChange}
            />
          </div>

          <div className="flex-1">
            <label htmlFor="surname" className={labelClassName}>
              Surname
            </label>
            <input
              type="text"
              id="surname"
              name="surname"
              placeholder={user.apellidos}
              className={inputClassName}
              value={profileData.surname}
              onChange={handleProfileChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="companyName" className={labelClassName}>
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            placeholder={user.empresa}
            className={inputClassName}
            value={profileData.companyName}
            onChange={handleProfileChange}
          />
        </div>

        <AnimatePresence>
          {isProfileDirty && (
            <motion.div
              className="flex gap-2 justify-end"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 20 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                type="button"
                variant="outline"
                onClick={handleProfileCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}
