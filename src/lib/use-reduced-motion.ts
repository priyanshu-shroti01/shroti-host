"use client";

import { useEffect, useState } from "react";

/** True when the user has asked the OS for reduced motion. GSAP tweens set inline styles directly, so they bypass the CSS `prefers-reduced-motion` rule in globals.css and must be gated in JS instead. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    // One-time environment check, not a render-driven update.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(query.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  return reduced;
}
