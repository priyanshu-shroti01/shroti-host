import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { HierarchyScene } from "@/components/scenes/hierarchy-scene";

export function ResellerHero() {
  return (
    <div className="relative">
      <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
        <Reveal className="text-center lg:text-left">
          <Eyebrow>Reseller Hosting</Eyebrow>
          <h1 className="mt-4 text-4xl font-extrabold leading-none tracking-tighter text-text-primary sm:text-5xl lg:text-6xl">
            Start your own hosting business.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary lg:mx-0">
            Full WHM access, white-label branding, and free WHMCS billing software — sell hosting
            under your own name.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Button href="#compare" size="lg">
              View plans
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </div>
        </Reveal>

        {/* Your brand provisioning client accounts — the reseller mechanic. */}
        <Reveal delay={0.1} className="hidden lg:block">
          <HierarchyScene variant="reseller" />
        </Reveal>
      </div>
    </div>
  );
}
