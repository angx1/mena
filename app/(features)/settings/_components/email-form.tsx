"use client";
import { Button } from "@/components/ui/button";
import { useState, FormEvent, ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EmailFormProps {
  user: {
    email?: string;
  };
  isVerified?: boolean;
  onSubmit?: (data: EmailFormData) => Promise<boolean | void>;
}

export interface EmailFormData {
  email: string;
}

const inputClassName =
  "mt-1 block w-full rounded-md border-2 border-gray-300 p-2 focus:border-gray-300";
const labelClassName = "block text-sm font-medium text-gray-700";

export default function EmailForm({
  user,
  isVerified = false,
  onSubmit,
}: EmailFormProps) {
  const [emailData, setEmailData] = useState<EmailFormData>({
    email: "",
  });
  const [isEmailDirty, setIsEmailDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailData({ email: value });
    setIsEmailDirty(value.trim() !== "");
  };

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;

    setIsSubmitting(true);
    try {
      const result = await onSubmit(emailData);
      if (result === true) {
        handleEmailCancel();
      }
    } catch (error) {
      console.error("Error submitting email data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailCancel = () => {
    setEmailData({ email: "" });
    setIsEmailDirty(false);
  };

  return (
    <motion.div
      className="border rounded-lg p-8"
      style={{ minHeight: isEmailDirty ? "auto" : "auto" }}
      animate={{
        borderColor: isEmailDirty ? "var(--accent)" : "",
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <form className="space-y-4" onSubmit={handleEmailSubmit}>
        <div>
          <div className="flex items-center justify-start mb-2">
            <label htmlFor="email" className={labelClassName}>
              Email
            </label>
            {user.email && (
              <Badge
                variant={isVerified ? "secondary" : "destructive"}
                className="ml-2"
              >
                {isVerified ? <>Confirmed</> : <>Pending confirmation</>}
              </Badge>
            )}
          </div>
          <input
            type="email"
            id="email"
            name="email"
            placeholder={user.email}
            className={inputClassName}
            value={emailData.email}
            onChange={handleEmailChange}
            disabled={isSubmitting}
          />
          <div className="flex flec-col justify-between mt-4">
            {!isVerified && user.email && (
              <p className="mt-1 text-sm text-amber-600">
                * Please check your inbox to verify your email address.
              </p>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isEmailDirty && (
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
                onClick={handleEmailCancel}
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
