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
    // Keep the browser chrome colour in step with the chosen theme.
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "dark" ? "#0a0a0f" : "#ffffff");
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage unavailable (private mode) — the theme still flips for this page view.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
    >
      {theme === "light" ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
}
