"use client";

import { deleteUserAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const button_style =
  "bg-gray-200 text-red-500 hover:bg-red-500 hover:text-white font-bold";

interface ProfileSettingsProps {
  user: {
    nombre?: string;
    apellidos?: string;
    email?: string;
    empresa?: string;
    email_verified?: string | null; // Add this field to track verification status
  };
}

export default function AccountSettings(data: ProfileSettingsProps) {
  const [email, setEmail] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleDeleteAccount = async () => {
    if (email === data.user.email) {
      // TODO
    }
  };

  return (
    <div className="flex flex-col gap-10 border border-red-300 rounded-lg p-8">
      <div className="flex flex-row items-center gap-10">
        <Link
          className="text-xs text-foreground underline"
          href="/forgot-password"
        >
          <Button className={button_style}>Reset password</Button>
        </Link>
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-mono font-bold ">Reset your password</span>
          <p>Redirect to the reset password's page</p>
        </div>
      </div>
      <Separator />

      <div className="flex flex-row items-center gap-10">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className={button_style}>Delete Account</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to delete your account?
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone. Please type your email address to
                confirm.
              </DialogDescription>
            </DialogHeader>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              disabled={isDeleting}
            />
            <DialogFooter>
              <AnimatePresence>
                {email === data.user.email && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 10 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Delete Account"
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-mono font-bold ">Delete your account</span>
          <p>Permanently delete your account</p>
        </div>
      </div>
    </div>
  );
}
