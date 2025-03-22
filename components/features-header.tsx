"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { config } from "@/config";
import { Button } from "@/components/ui/button";

const FeaturesHeader = () => {
  const pathname = usePathname();

  const routes = [
    { href: config.routes.home, name: "Home" },
    { href: config.routes.trips, name: "Trips" },
    { href: config.routes.generations, name: "Generations" },
  ];

  return (
    <nav>
      <div className="flex items-center">
        <div className="flex space-x-8">
          {routes.map((item) => (
            <Link
              href={item.href}
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                pathname === item.href
                  ? "text-black border-b-2 border-black"
                  : "text-black hover:text-gray-700"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default FeaturesHeader;
