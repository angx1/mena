import HeaderAuth from "@/components/header-auth";
import FeaturesHeader from "@/components/features-header";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Mena",
  description: "ai-powered travel manager for business sales professionals.",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="sticky top-0 z-50 bg-background">
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
              <div className="w-full max-w-7xl flex justify-between p-3 px-4 sm:px-6 lg:px-8 gap-5 text-sm">
                <HeaderAuth />
              </div>
            </nav>
          </header>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div>{children}</div>
          </main>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "white",
                color: "black",
                border: "1px solid var(--accent)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
