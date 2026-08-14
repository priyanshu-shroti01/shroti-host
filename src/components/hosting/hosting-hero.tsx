"use client";

import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { StatPill } from "@/components/ui/stat-pill";
import { HostingScene } from "@/components/scenes/hosting-scene";
import { commonFeatures, sharedPlans } from "@/lib/plans";
import { useCurrency } from "@/components/currency-provider";

export function HostingHero() {
  const { currency, convertDisplay } = useCurrency();
  const currencySymbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : "€";

  return (
    <div className="relative overflow-hidden">
      <HeroAtmosphere />
      <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
        <Reveal className="text-center lg:text-left">
          <Badge>Shared Hosting</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            Configured for your site, not a generic server.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary lg:mx-0">
            Pick what you actually need below — storage, traffic, PHP, email — and we&apos;ll match
            it to a plan instantly.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Magnetic>
              <Button href="#configure" size="lg">
                Configure now
                <ArrowRight size={18} aria-hidden="true" />
              </Button>
            </Magnetic>
            <Button href="#compare" variant="secondary" size="lg">
              Skip to plans
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-border pt-6 text-sm lg:justify-start">
            <span className="text-text-secondary">
              From{" "}
              <span className="font-semibold text-text-primary">
                <AnimatedCounter
                  key={currency}
                  value={convertDisplay(sharedPlans[0].monthlyPrice)}
                  prefix={currencySymbol}
                  suffix="/mo"
                />
              </span>
            </span>
            {commonFeatures.slice(0, 4).map((f) => (
              <StatPill key={f} icon={Check} iconClassName="text-success">
                {f}
              </StatPill>
            ))}
          </div>
        </Reveal>

        {/* One server, many sites — the shared-hosting mechanic as a scene. */}
        <Reveal delay={0.1} className="hidden lg:block">
          <HostingScene />
        </Reveal>
      </div>
    </div>
  );
}
