import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";

const outline = "border-white/50 bg-transparent text-white hover:border-white hover:bg-white/10 hover:text-white";

export function FinalCta() {
  return (
    <Reveal>
      <div
        className="relative overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-16 sm:py-20"
        style={{ background: "var(--gradient-hero-deep)" }}
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
            Start with a domain. Stay for the infrastructure.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white">
            From your first domain to production infrastructure — hosting, development, and one
            team that carries the whole thing.
          </p>
          {/* One solid action; the other two are outlines so the panel has a
              single obvious next step instead of three equal buttons. */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Magnetic>
              <Button
                href="/hosting"
                variant="inverse"
                size="lg"
              >
                Get Hosting
                <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </Magnetic>
            <Button href="/web-development" variant="secondary" size="lg" className={outline}>
              Start a Project
            </Button>
            <Button href="/contact" variant="secondary" size="lg" className={outline}>
              Talk to Us
            </Button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
