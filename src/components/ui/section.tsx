import type { ReactNode } from "react";
import { Container } from "./container";

export function Section({
  children,
  className = "",
  containerClassName = "",
  id,
  backdrop,
  compact = false,
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
  /** Full-bleed layer (e.g. HeroAtmosphere) rendered behind the Container,
   *  spanning the whole section including its padding — atmosphere must
   *  never render inside the Container or it reads as a boxed tint. */
  backdrop?: ReactNode;
  /** Shorter vertical rhythm (`py-12 sm:py-16`) for supporting sections —
   *  testimonials, FAQ, the project selector — so the page breathes
   *  unevenly instead of every block getting the same 112px. */
  compact?: boolean;
}) {
  const rhythm = compact ? "py-12 sm:py-16" : "py-20 sm:py-28";
  return (
    <section id={id} className={`relative ${rhythm} ${className}`}>
      {/* Clip only the backdrop layer — never the section itself. The
          atmosphere floor overflows and needs clipping, but section content
          (e.g. the domain-search results dropdown) must be free to extend
          past the section edge. */}
      {backdrop && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {backdrop}
        </div>
      )}
      <Container className={`relative ${containerClassName}`}>{children}</Container>
    </section>
  );
}

/** The single page/section-level eyebrow. `Badge` is for in-card status only. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border-strong px-3 py-1 text-xs font-medium tracking-wide text-brand-purple-text uppercase">
      {children}
    </span>
  );
}
