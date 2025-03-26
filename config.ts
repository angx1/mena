import {
  Home,
  Map,
  Sparkles,
  Settings,
  Wallet,
  StickyNote,
  LayoutPanelLeft,
} from "lucide-react";

export const config = {
  routes: [
    { href: "/home", name: "Home", icon: Home },
    { href: "/trips", name: "Trips", icon: Map },
    { href: "/generations", name: "Generations", icon: Sparkles },
    { href: "/settings", name: "Settings", icon: Settings },
  ],
  tripRoutes: [
    { href: "/", name: "Summary", icon: LayoutPanelLeft },
    { href: "/expenses", name: "Expenses", icon: Wallet },
    { href: "/notes", name: "Notes", icon: StickyNote },
  ],
};
