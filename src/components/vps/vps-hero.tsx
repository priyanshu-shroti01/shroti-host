import { ArrowRight, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { VpsScene } from "@/components/scenes/vps-scene";

export function VpsHero() {
  return (
    <div className="relative">
      <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
        <Reveal className="text-center lg:text-left">
          <Eyebrow>Coming Soon</Eyebrow>
          <h1 className="mt-4 text-4xl font-extrabold leading-none tracking-tighter text-text-primary sm:text-5xl lg:text-6xl">
            VPS Hosting is coming.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary lg:mx-0">
            Dedicated vCPU, RAM, and NVMe storage — full root access, none of the noisy neighbors.
            We&apos;re building it next.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Button href="https://portal.shrotihost.in/submitticket.php" size="lg">
              <LifeBuoy size={18} aria-hidden="true" />
              Get notified at launch
            </Button>
            <Button href="/hosting#compare" variant="secondary" size="lg">
              Explore Scale hosting today
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </div>
        </Reveal>

        {/* One machine, four isolated slices — each workload spikes alone. */}
        <Reveal delay={0.1} className="hidden lg:block">
          <VpsScene />
        </Reveal>
      </div>
    </div>
  );
}
