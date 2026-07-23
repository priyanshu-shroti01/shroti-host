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
      className={`rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors ${
        glow ? "hover:border-border-strong" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
