
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { HierarchyScene } from "@/components/scenes/hierarchy-scene";

export function AlphaResellerHero() {
  return (
    <div className="relative">
      <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
        <Reveal className="text-center lg:text-left">
          <Eyebrow>Coming Soon</Eyebrow>
          <h1 className="mt-4 text-4xl font-extrabold leading-none tracking-tighter text-text-primary sm:text-5xl lg:text-6xl">
            The elite tier. Maximum resources.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary lg:mx-0">
            A full three-level hierarchy — cPanel, WHM reseller, and Master Reseller accounts —
            for the largest hosting networks we support.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Button href={`https://wa.me/919582129099?text=${encodeURIComponent("Hi! Please add me to the Alpha Reseller Hosting waitlist.")}`} size="lg">
              Join the waitlist
            </Button>
          </div>
        </Reveal>

        {/* The full three-level network, crown tier glowing at the top. */}
        <Reveal delay={0.1} className="hidden lg:block">
          <HierarchyScene variant="alpha" />
        </Reveal>
      </div>
    </div>
  );
}
