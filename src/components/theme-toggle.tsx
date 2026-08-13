"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light" | null>(null);

  useEffect(() => {
    // One-time sync with the theme the inline head script already applied,
    // so server and first client render agree (avoids hydration mismatch).
    const current = document.documentElement.getAttribute("data-theme");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
    >
      {theme === "light" ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
}
