import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";

export function FinalCta() {
  return (
    <Reveal>
      <div
        className="relative overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-16 sm:py-20"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
          aria-hidden="true"
        />
        <div className="relative">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Start Your Next Project Today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Affordable, reliable hosting with free migration and no hidden fees. Launch in
            minutes, grow without limits.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Magnetic>
              <Button
                href="/hosting"
                variant="secondary"
                size="lg"
                className="border-white/40 bg-white text-brand-purple hover:bg-white/90"
              >
                Launch Your Website
                <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </Magnetic>
            <Button href="/contact" size="lg" className="bg-white/10 text-white hover:bg-white/20">
              Talk to Us
            </Button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
