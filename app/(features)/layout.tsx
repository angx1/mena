import { ReactNode } from "react";
import FeaturesHeader from "@/components/features-header";

interface FeaturesLayoutProps {
  children: ReactNode;
}

export default function FeaturesLayout({ children }: FeaturesLayoutProps) {
  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FeaturesHeader />
        <div className="py-8">
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
