"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { sharedPlans, cycleMonths, savePercent, type Cycle, type Plan } from "@/lib/plans";
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
            <Reveal key={plan.name} delay={i * 0.08} className={plan.recommended ? "lg:scale-105" : undefined}>
              <div data-theme={plan.recommended ? "dark" : undefined}>
              <Card
                className={`flex h-full flex-col transition-all duration-300 hover:-translate-y-1 ${
                  plan.recommended ? "border-transparent shadow-[var(--shadow-popular)]" : ""
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

                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-text-secondary">
                      <Check size={16} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  href="/hosting"
                  variant={plan.recommended ? "primary" : "secondary"}
                  size="lg"
                  className="mt-8 w-full"
                >
                  Choose {plan.name}
                </Button>
              </Card>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
