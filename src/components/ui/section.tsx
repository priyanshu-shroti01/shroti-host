import type { ReactNode } from "react";
import { Container } from "./container";

export function Section({
  children,
  className = "",
  containerClassName = "",
  id,
  backdrop,
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
  /** Full-bleed layer (e.g. HeroAtmosphere) rendered behind the Container,
   *  spanning the whole section including its padding — atmosphere must
   *  never render inside the Container or it reads as a boxed tint. */
  backdrop?: ReactNode;
}) {
  return (
    <section id={id} className={`relative py-20 sm:py-28 ${className}`}>
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

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border-strong px-3 py-1 text-xs font-medium tracking-wide text-brand-purple uppercase">
      {children}
    </span>
  );
}
