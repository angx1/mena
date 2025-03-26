import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TripLayout {
  children: ReactNode;
}

export default function TripLayout({ children }: TripLayout) {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col">
        <Link href="/trips">
          <Button variant="outline" className="hover:bg-gray-100">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="py-8">
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
