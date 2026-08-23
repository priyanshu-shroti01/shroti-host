"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

/** Server (and hydration) snapshot: assume motion is fine, then re-render with the real value. */
function getServerSnapshot() {
  return false;
}

/** True when the user has asked the OS for reduced motion. GSAP tweens set inline styles directly, so they bypass the CSS `prefers-reduced-motion` rule in globals.css and must be gated in JS instead. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
