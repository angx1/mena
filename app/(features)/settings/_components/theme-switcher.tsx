"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

const ICON_SIZE = 32;

export function ModeToggle() {
  const { setTheme } = useTheme();
  const [selected, setSelected] = React.useState<string>("light");

  return (
    <div className="flex flex-row justify-between gap-5">
      <div className="flex flex-col justify-between">
        <div>
          <h2 className="mr-8">Toggle theme</h2>
          <p className="font-mono text-sm">change the app's general theme</p>
        </div>
        <div className="border rounded-lg p-3 w-fit">
          <p className="font-mono text-sm">
            selected:{" "}
            <span className="font-bold text-sm text-[var(--accent)]">
              {selected}{" "}
            </span>
          </p>
        </div>
      </div>
      <div className="flex flex-row justify-start gap-5">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setTheme("light");
            setSelected("light");
          }}
          title="Light theme"
          className="h-28 w-28 p-2"
        >
          <Sun style={{ height: ICON_SIZE, width: ICON_SIZE }} />
          <span className="sr-only">Light theme</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setTheme("dark");
            setSelected("dark");
          }}
          title="Dark theme"
          className="h-28 w-28 p-2"
        >
          <Moon style={{ height: ICON_SIZE, width: ICON_SIZE }} />
          <span className="sr-only">Dark theme</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setTheme("system");
            setSelected("system");
          }}
          title="System theme"
          className="h-28 w-28 p-2"
        >
          <Monitor style={{ height: ICON_SIZE, width: ICON_SIZE }} />
          <span className="sr-only">System theme</span>
        </Button>
      </div>
    </div>
  );
}
