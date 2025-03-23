import { Home, Map, Sparkles, Settings } from "lucide-react";

export const config = {
  routes: [
    { href: "/home", name: "Home", icon: Home },
    { href: "/trips", name: "Trips", icon: Map },
    { href: "/generations", name: "Generations", icon: Sparkles },
    { href: "/settings", name: "Settings", icon: Settings },
  ],
};
