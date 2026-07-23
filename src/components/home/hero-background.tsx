"use client";

import { motion } from "framer-motion";

export function HeroBackground() {
  return (
    <>
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-glow)" }}
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "linear-gradient(to bottom, black, transparent 85%)",
        }}
        aria-hidden="true"
      />
    </>
  );
}
