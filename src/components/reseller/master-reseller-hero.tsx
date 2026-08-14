import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { HierarchyScene } from "@/components/scenes/hierarchy-scene";

export function MasterResellerHero() {
  return (
    <div className="relative overflow-hidden">
      <HeroAtmosphere />
      <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
        <Reveal className="text-center lg:text-left">
          <Badge>Master Reseller Hosting</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            Create resellers of your own.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary lg:mx-0">
            Everything in Reseller Hosting, plus WHM reseller accounts you can hand out — build a
            hosting business with its own hosting businesses inside it.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Button href="#compare" size="lg">
              View plans
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </div>
        </Reveal>

        {/* You → WHM resellers → their clients: one level deeper than reseller. */}
        <Reveal delay={0.1} className="hidden lg:block">
          <HierarchyScene variant="master" />
        </Reveal>
      </div>
    </div>
  );
}
