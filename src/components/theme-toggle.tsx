"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const isCharcoal = ready && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isCharcoal ? "Switch to light" : "Switch to charcoal"}
      title={isCharcoal ? "Light" : "Charcoal"}
      onClick={() => setTheme(isCharcoal ? "light" : "dark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground hover:bg-muted"
    >
      {isCharcoal ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
