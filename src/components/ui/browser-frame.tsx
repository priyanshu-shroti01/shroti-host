import type { ReactNode } from "react";

/**
 * Browser/terminal chrome around a mockup. Both variants draw from tokens:
 * "dark" flips the frame to the page canvas (`bg-bg`) with white-alpha
 * chrome so it reads as a terminal in either theme — no literal hex.
 */
export function BrowserFrame({
  url,
  children,
  variant = "light",
  className = "",
}: {
  url: string;
  children: ReactNode;
  variant?: "light" | "dark";
  className?: string;
}) {
  const isDark = variant === "dark";
  return (
    <div
      className={`overflow-hidden rounded-2xl border shadow-[var(--shadow-raised)] ${
        isDark ? "border-border-strong bg-bg" : "border-border-strong bg-card"
      } ${className}`}
    >
      <div
        className={`flex items-center gap-2 border-b px-4 py-3 ${
          isDark ? "border-border" : "border-border bg-surface-raised"
        }`}
      >
        <span className={`h-2.5 w-2.5 rounded-full ${isDark ? "bg-error" : "bg-error/60"}`} />
        <span className={`h-2.5 w-2.5 rounded-full ${isDark ? "bg-warning" : "bg-warning/60"}`} />
        <span className={`h-2.5 w-2.5 rounded-full ${isDark ? "bg-success" : "bg-success/60"}`} />
        <span className="ml-2 truncate rounded-full bg-surface px-3 py-1 font-mono text-xs text-text-muted">
          {url}
        </span>
      </div>
      {children}
    </div>
  );
}
