"use client";

import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { StatPill } from "@/components/ui/stat-pill";
import { alphaResellerPlans } from "@/lib/plans";
import { useCurrency } from "@/components/currency-provider";

const HERO_FEATURES = ["Free WHMCS Billing Software", "DDoS & Imunify360 Protection", "24/7 Priority Support"];

export function AlphaResellerHero() {
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
        <Badge>Alpha Reseller Hosting</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
          The elite tier. Maximum resources.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">
          A full three-level hierarchy — cPanel, WHM reseller, and Master Reseller accounts —
          for the largest hosting networks we support.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button href="#compare" size="lg">
            View plans
            <ArrowRight size={18} aria-hidden="true" />
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-border pt-6 text-sm">
          <span className="text-text-secondary">
            From{" "}
            <span className="font-semibold text-text-primary">
              <AnimatedCounter
                key={currency}
                value={convertDisplay(alphaResellerPlans[0].monthlyPrice)}
                prefix={currencySymbol}
                suffix="/mo"
              />
            </span>
          </span>
          {HERO_FEATURES.map((f) => (
            <StatPill key={f} icon={Check} iconClassName="text-success">
              {f}
            </StatPill>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
