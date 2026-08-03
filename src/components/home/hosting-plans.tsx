"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Headset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { ResourceMeter } from "@/components/ui/resource-meter";
import { sharedPlans, commonFeatures, cycleMonths, savePercent, type Cycle, type Plan } from "@/lib/plans";
import { useCurrency } from "@/components/currency-provider";

const cycleLabels: Record<Cycle, string> = {
  monthly: "Monthly",
  quarterly: "3 Months",
  semiAnnual: "6 Months",
  annual: "Annual",
};

export function HostingPlans({ plans = sharedPlans }: { plans?: Plan[] }) {
  const [cycle, setCycle] = useState<Cycle>("annual");
  const { currency, convertDisplay } = useCurrency();
  const currencySymbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : "€";

  const maxWebsites = Math.max(...plans.map((p) => p.meters.websites).filter(Number.isFinite));
  const maxStorage = Math.max(...plans.map((p) => p.meters.storageGB).filter(Number.isFinite));
  const maxMailboxes = Math.max(...plans.map((p) => p.meters.mailboxes).filter(Number.isFinite));

  return (
    <div id="compare">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Simple, honest pricing
        </h2>
        <p className="mt-4 text-text-secondary">
          Same renewal price, every cycle — no surprise increase later.
        </p>
      </div>

      <div className="mt-10 flex justify-center">
        <div className="inline-flex flex-wrap justify-center gap-1 rounded-full border border-border p-1">
          {(Object.keys(cycleLabels) as Cycle[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCycle(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors sm:px-5 ${
                cycle === c ? "bg-brand-purple text-white" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {cycleLabels[c]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-4">
        {plans.map((plan, i) => {
          const months = cycleMonths[cycle];
          const saleTotal = plan.monthlyPrice * months;
          const regularTotal = plan.monthlyRegularPrice * months;
          const save = savePercent(plan);

          return (
            <Reveal key={plan.name} delay={i * 0.08}>
              <Card
                className={`flex h-full flex-col transition-transform duration-300 hover:-translate-y-1 ${
                  plan.recommended ? "border-brand-purple ring-1 ring-brand-purple" : ""
                }`}
              >
                {plan.recommended && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.2 }}
                    className="mb-4 w-fit"
                  >
                    <Badge tone="purple">Most Popular</Badge>
                  </motion.div>
                )}

                <h3 className="text-xl font-semibold text-text-primary">{plan.name}</h3>
                <p className="mt-1 text-sm text-text-muted">{plan.tagline}</p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-semibold text-text-primary">
                    <AnimatedCounter
                      key={`${plan.name}-${cycle}-${currency}`}
                      value={convertDisplay(saleTotal)}
                      prefix={currencySymbol}
                    />
                  </span>
                  <span className="text-sm text-text-muted line-through">
                    {currencySymbol}
                    {Math.round(convertDisplay(regularTotal)).toLocaleString("en-US")}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-xs text-text-muted">Billed {cycleLabels[cycle].toLowerCase()}</p>
                  <Badge tone="success" className="text-[10px]">
                    Save {save}%
                  </Badge>
                </div>

                <div className="mt-6 flex-1 space-y-4">
                  <ResourceMeter
                    label="Websites"
                    valueLabel={plan.specs.websites}
                    value={plan.meters.websites}
                    max={maxWebsites}
                    emphasis={plan.recommended}
                  />
                  <ResourceMeter
                    label="Storage"
                    valueLabel={plan.specs.storage}
                    value={plan.meters.storageGB}
                    max={maxStorage}
                    delay={0.08}
                    emphasis={plan.recommended}
                  />
                  <ResourceMeter
                    label="Email"
                    valueLabel={plan.specs.email}
                    value={plan.meters.mailboxes}
                    max={maxMailboxes}
                    delay={0.16}
                    emphasis={plan.recommended}
                  />
                  {plan.additionalMeters?.map((meter, meterIndex) => (
                    <ResourceMeter
                      key={meter.label}
                      label={meter.label}
                      valueLabel={meter.valueLabel}
                      value={meter.value}
                      max={Math.max(...plans.flatMap((p) => p.additionalMeters?.[meterIndex]?.value ?? []).filter(Number.isFinite))}
                      delay={0.24}
                      emphasis={plan.recommended}
                    />
                  ))}

                  <div className="flex items-center gap-2 border-t border-border pt-4 text-sm">
                    <Headset size={16} className="text-brand-purple" aria-hidden="true" />
                    <span className="text-text-secondary">{plan.specs.support}</span>
                  </div>
                </div>

                <Button
                  href="/hosting"
                  variant={plan.recommended ? "primary" : "secondary"}
                  size="lg"
                  className="mt-8 w-full"
                >
                  Choose {plan.name}
                </Button>
              </Card>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.3}>
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface/40 px-6 py-5 sm:flex-row sm:justify-center sm:gap-x-6 sm:gap-y-2 sm:flex-wrap">
          <span className="text-xs font-medium uppercase tracking-wide text-text-muted">On every plan</span>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {commonFeatures.map((feature) => (
              <span key={feature} className="inline-flex items-center gap-1.5 text-sm text-text-secondary">
                <Check size={14} className="text-success" aria-hidden="true" />
                {feature}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
