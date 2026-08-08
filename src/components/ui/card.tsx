import type { ReactNode } from "react";

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
      className={`rounded-2xl border-2 border-border bg-card p-6 shadow-[var(--shadow-card)] transition-all ${
        glow ? "hover:-translate-y-1 hover:border-border-strong hover:shadow-[var(--shadow-raised)]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
