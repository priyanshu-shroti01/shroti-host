import type { ReactNode } from "react";

type Tone = "purple" | "blue" | "success" | "neutral";

// Text tones use the `-text` contrast token (AA on bg and card in both themes).
const tones: Record<Tone, string> = {
  purple: "bg-brand-purple/10 text-brand-purple-text border-brand-purple/20",
  blue: "bg-brand-blue/10 text-brand-blue border-brand-blue/20",
  success: "bg-success/10 text-success border-success/20",
  neutral: "bg-surface text-text-secondary border-border-strong",
};

/** In-card status pill ("Most Popular", "Coming soon", "You are here").
 *  Page-level eyebrows use `<Eyebrow>` from ui/section instead. */
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
      className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-bold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
