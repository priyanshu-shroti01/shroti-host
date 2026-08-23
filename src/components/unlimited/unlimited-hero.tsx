import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { UnlimitedScene } from "@/components/scenes/unlimited-scene";
import { SitesGridDemo } from "./sites-grid-demo";

export function UnlimitedHero() {
  return (
    <div className="relative">
      <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
        <Reveal className="text-center lg:text-left">
          <Eyebrow>Unlimited Hosting</Eyebrow>
          <h1 className="mt-4 text-4xl font-extrabold leading-none tracking-tighter text-text-primary sm:text-5xl lg:text-6xl">
            One plan. As many sites as you run.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary lg:mx-0">
            Built for agencies and developers managing client sites — add a site without adding
            a bill.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Button href="#compare" size="lg">
              View Scale plan
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </div>
        </Reveal>

        {/* The stack that keeps growing — a ghost plate forever rising off the top. */}
        <Reveal delay={0.1} className="hidden lg:block">
          <UnlimitedScene />
        </Reveal>
      </div>

      <Reveal delay={0.1} className="relative mt-12">
        <SitesGridDemo />
      </Reveal>
    </div>
  );
}
