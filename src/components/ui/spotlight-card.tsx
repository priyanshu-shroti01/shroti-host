"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

/**
 * Card with a cursor-tracked radial glow, applied via CSS custom properties
 * so it costs no re-renders (no React state on mousemove). The spotlight is
 * the whole hover effect — the card does not lift (it is not a link).
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
      className={`group relative overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-250 ease-out-quart hover:border-brand-purple/40 hover:shadow-[var(--shadow-spotlight)] ${className}`}
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
