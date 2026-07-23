import { ArrowRight, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";

export function VpsHero() {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-glow)" }}
        aria-hidden="true"
      />
      <Reveal className="relative mx-auto max-w-2xl text-center">
        <Badge tone="neutral">Coming Soon</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
          VPS Hosting is coming.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">
          Dedicated vCPU, RAM, and NVMe storage — full root access, none of the noisy neighbors.
          We&apos;re building it next.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
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
    </div>
  );
}
