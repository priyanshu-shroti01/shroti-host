import type { ReactNode } from "react";

/**
 * Opaque, shadow-elevated card: one depth cue (1px border + `--shadow-card`).
 * `glow` is for cards that are themselves a link target — it raises the
 * shadow on hover without moving the card (no lift on static content).
 */
export function Card({
  children,
  className = "",
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-(--duration-fast) ease-out-quart ${
        glow ? "hover:border-border-strong hover:shadow-[var(--shadow-raised)]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
