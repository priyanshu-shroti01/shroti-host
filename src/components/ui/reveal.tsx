"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  // Framer writes inline styles, so the global reduced-motion CSS clamp can't
  // reach it — gate in JS. Duration/initial re-evaluate on re-render, so even
  // if the hook resolves true after mount the reveal collapses to instant.
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
