"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  InfoIcon,
  Moon,
  LockKeyhole,
  Sun,
  UserCircle,
  Settings as SettingsIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SettingsNavbar() {
  const [activeSection, setActiveSection] = useState<string>("profile");

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["profile", "appearance", "account"];

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "profile", name: "Profile", icon: UserCircle },
    { id: "appearance", name: "Appearance", icon: Sun },
    { id: "account", name: "Account", icon: LockKeyhole },
  ];

  return (
    <div className="flex flex-col gap-3">
      <nav className="flex flex-col space-y-1 border rounded-lg p-2">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const IconComponent = item.icon;

          return (
            <Link
              key={item.id}
              href={`/settings#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.id);
              }}
              className={cn(
                "justify-start flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                isActive ? "bg-secondary" : "hover:bg-accent"
              )}
            >
              {IconComponent && (
                <span className="mr-2">
                  <IconComponent size={18} />
                </span>
              )}
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
