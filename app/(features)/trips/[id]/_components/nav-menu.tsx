"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { config } from "@/config";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function NavMenu() {
  const pathname = usePathname();
  const tripId = pathname.split("/")[2]; // Extract trip ID from pathname

  return (
    <div className="flex flex-col gap-3">
      <Link href="/trips">
        <Button variant="ghost" className="hover:bg-gray-100">
          <ArrowLeft className="h-4 w-4" />
          Trips
        </Button>
      </Link>
      <nav className="flex flex-col space-y-1 border rounded-lg p-2">
        {config.tripRoutes.map((item) => {
          const fullPath = `/trips/${tripId}${item.href}`;
          const isActive =
            pathname === fullPath || pathname.endsWith(item.href);
          const IconComponent = item.icon;

          return (
            <Link
              key={item.href}
              href={fullPath}
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                isActive
                  ? "bg-secondary text-secondary-foreground"
                  : "hover:bg-secondary/80"
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
