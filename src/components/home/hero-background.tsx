"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const PARTICLES = [
  { top: "18%", left: "12%", size: 4, duration: 9, delay: 0 },
  { top: "62%", left: "8%", size: 3, duration: 11, delay: 1.2 },
  { top: "30%", left: "42%", size: 3, duration: 8, delay: 2.1 },
  { top: "75%", left: "38%", size: 4, duration: 12, delay: 0.6 },
  { top: "12%", left: "68%", size: 3, duration: 10, delay: 1.8 },
  { top: "48%", left: "82%", size: 4, duration: 9.5, delay: 0.3 },
  { top: "85%", left: "70%", size: 3, duration: 11.5, delay: 2.6 },
];

export function HeroBackground() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function onMouseMove(e: MouseEvent) {
      glowRef.current?.style.setProperty("--mx", `${e.clientX}px`);
      glowRef.current?.style.setProperty("--my", `${e.clientY}px`);
    }
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

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
        className="pointer-events-none absolute inset-0 opacity-[0.012] motion-safe:animate-[drift-grid_24s_linear_infinite]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
        aria-hidden="true"
      />

      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 sm:opacity-100"
        style={{
          background:
            "radial-gradient(320px circle at var(--mx, 50%) var(--my, 20%), rgb(168 16 199 / 0.06), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-brand-purple/40"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              animation: `float-slow ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
