import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { SitesGridDemo } from "./sites-grid-demo";

export function UnlimitedHero() {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-glow)" }}
        aria-hidden="true"
      />
      <Reveal className="relative mx-auto max-w-2xl text-center">
        <Badge>Unlimited Hosting</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
          One plan. As many sites as you run.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">
          Built for agencies and developers managing client sites — add a site without adding
          a bill.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button href="#compare" size="lg">
            View Scale plan
            <ArrowRight size={18} aria-hidden="true" />
          </Button>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="relative mt-12">
        <SitesGridDemo />
      </Reveal>
    </div>
  );
}
