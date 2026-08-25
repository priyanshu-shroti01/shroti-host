"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Eases a number toward its target so a recalculated total reads as a change
 * rather than a jump-cut. Reduced motion gets the value immediately — the
 * information is identical, only the transition is dropped.
 */
export function useAnimatedNumber(target: number, durationMs = 420): number {
  const reducedMotion = usePrefersReducedMotion();
  const [animated, setAnimated] = useState(target);
  // Reduced motion never reads the animated value, so it never needs a render
  // just to say "use the target instead".
  const value = reducedMotion ? target : animated;
  const fromRef = useRef(target);
  const startRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (reducedMotion) {
      fromRef.current = target;
      return;
    }

    const from = fromRef.current;
    if (from === target) return;

    startRef.current = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - startRef.current) / durationMs, 1);
      // ease-out-quart, matching the CSS token used elsewhere on the page
      const eased = 1 - Math.pow(1 - t, 4);
      const next = from + (target - from) * eased;
      fromRef.current = next;
      setAnimated(next);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = target;
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, durationMs, reducedMotion]);

  return value;
}
