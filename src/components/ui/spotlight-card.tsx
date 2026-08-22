"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

/**
 * Card with a cursor-tracked radial glow, applied via CSS custom properties
 * so it costs no re-renders (no React state on mousemove).
 */
export function SpotlightCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    ref.current!.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
    ref.current!.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={`group relative overflow-hidden rounded-2xl border-2 border-border bg-card shadow-[var(--shadow-card)] transition-all duration-[250ms] ease-[cubic-bezier(0.33,1,0.68,1)] hover:-translate-y-1 hover:border-brand-purple/40 hover:shadow-[0_0_0_1px_rgb(168_16_199/0.15),0_12px_28px_-10px_rgb(168_16_199/0.3)] ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(400px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgb(168 16 199 / 0.12), transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
