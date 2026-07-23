import type { ReactNode } from "react";

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
      className={`overflow-hidden rounded-2xl border shadow-2xl ${
        isDark ? "border-white/10 bg-[#0d0d12]" : "border-border-strong bg-card"
      } ${className}`}
    >
      <div
        className={`flex items-center gap-2 border-b px-4 py-3 ${
          isDark ? "border-white/10" : "border-border bg-surface-raised"
        }`}
      >
        <span className={`h-2.5 w-2.5 rounded-full ${isDark ? "bg-[#ff5f57]" : "bg-error/60"}`} />
        <span className={`h-2.5 w-2.5 rounded-full ${isDark ? "bg-[#febc2e]" : "bg-warning/60"}`} />
        <span className={`h-2.5 w-2.5 rounded-full ${isDark ? "bg-[#28c840]" : "bg-success/60"}`} />
        <span
          className={`ml-2 truncate rounded-md px-3 py-1 font-mono text-xs ${
            isDark ? "bg-white/5 text-white/40" : "bg-surface text-text-muted"
          }`}
        >
          {url}
        </span>
      </div>
      {children}
    </div>
  );
}
