
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { HierarchyScene } from "@/components/scenes/hierarchy-scene";

export function MasterResellerHero() {
  return (
    <div className="relative">
      <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
        <Reveal className="text-center lg:text-left">
          <Eyebrow>Coming Soon</Eyebrow>
          <h1 className="mt-4 text-4xl font-extrabold leading-none tracking-tighter text-text-primary sm:text-5xl lg:text-6xl">
            Create resellers of your own.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary lg:mx-0">
            Everything in Reseller Hosting, plus WHM reseller accounts you can hand out — build a
            hosting business with its own hosting businesses inside it.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Button href={`https://wa.me/919582129099?text=${encodeURIComponent("Hi! Please add me to the Master Reseller Hosting waitlist.")}`} size="lg">
              Join the waitlist
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
