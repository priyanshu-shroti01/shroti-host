import type { ReactNode } from "react";

type Tone = "purple" | "blue" | "success" | "neutral";

const tones: Record<Tone, string> = {
  purple: "bg-brand-purple/10 text-brand-purple border-brand-purple/20",
  blue: "bg-brand-blue/10 text-brand-blue border-brand-blue/20",
  success: "bg-success/10 text-success border-success/20",
  neutral: "bg-surface text-text-secondary border-border-strong",
};

export function Badge({
  children,
  tone = "purple",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
