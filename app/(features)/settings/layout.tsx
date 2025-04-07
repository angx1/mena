import { ReactNode } from "react";
import Link from "next/link";
import SettingsNavbar from "./_components/settings-navbar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TripLayout {
  children: ReactNode;
}

export default function TripLayout({ children }: TripLayout) {
  return (
    <div className="min-h-screen overflow-hidden">
      <div className="flex flex-col">
        <div className="flex flex-row gap-10">
          <SettingsNavbar />
          <ScrollArea className="flex-1 h-[calc(100vh-2rem)]">
            <main className="flex justify-start">{children}</main>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
