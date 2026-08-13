"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/** Wraps a button/link and gives it a subtle magnetic pull toward the cursor on hover. */
export function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const reducedMotion = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

  function onMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  // Pointer-chasing springs are pure decoration under reduced motion — render
  // the child statically instead (Framer inline styles bypass the CSS clamp).
  if (reducedMotion) {
    return <div className="inline-block">{children}</div>;
  }

  return (
    <motion.div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}
