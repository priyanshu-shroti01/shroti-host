"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { commonFeatures, sharedPlans } from "@/lib/plans";
import { useCurrency } from "@/components/currency-provider";

export function HostingHero() {
  const { currency, convertDisplay } = useCurrency();
  const currencySymbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : "€";

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-glow)" }}
        aria-hidden="true"
      />
      <Reveal className="relative mx-auto max-w-2xl text-center">
        <Badge>Shared Hosting</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
          Configured for your site, not a generic server.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">
          Pick what you actually need below — storage, traffic, PHP, email — and we&apos;ll match
          it to a plan instantly.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
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

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-border pt-6 text-sm">
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
            <span key={f} className="text-text-muted">
              {f}
            </span>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
