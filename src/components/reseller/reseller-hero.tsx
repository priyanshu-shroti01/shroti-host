import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { HierarchyScene } from "@/components/scenes/hierarchy-scene";

export function ResellerHero() {
  return (
    <div className="relative overflow-hidden">
      <HeroAtmosphere />
      <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
        <Reveal className="text-center lg:text-left">
          <Badge>Reseller Hosting</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
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
