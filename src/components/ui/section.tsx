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
    <section id={id} className={`relative py-20 sm:py-28 ${backdrop ? "overflow-hidden" : ""} ${className}`}>
      {backdrop}
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
