"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { plans } from "@/lib/plans";
import { useCurrency } from "@/components/currency-provider";

type Cycle = "monthly" | "quarterly" | "annual";

const cycleLabels: Record<Cycle, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  annual: "Annual · Save up to 35%",
};

function priceFor(plan: (typeof plans)[number], cycle: Cycle) {
  if (cycle === "annual") return plan.annualPrice;
  if (cycle === "quarterly") return plan.quarterlyPrice;
  return plan.monthlyPrice;
}

export function HostingPlans() {
  const [cycle, setCycle] = useState<Cycle>("annual");
  const [expanded, setExpanded] = useState<string | null>(null);
  const { currency, convertDisplay } = useCurrency();
  const currencySymbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : "€";

  return (
    <div id="compare">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Simple, honest pricing
        </h2>
        <p className="mt-4 text-text-secondary">
          Pick a billing cycle. Renewal pricing is always shown upfront — no surprises later.
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

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {plans.map((plan, i) => {
          const isExpanded = expanded === plan.name;
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

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold text-text-primary">
                    <AnimatedCounter
                      key={`${plan.name}-${cycle}-${currency}`}
                      value={convertDisplay(priceFor(plan, cycle))}
                      prefix={currencySymbol}
                    />
                  </span>
                  <span className="text-sm text-text-muted">/mo</span>
                </div>
                <p className="mt-1 text-xs text-text-muted">Billed {cycle}</p>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
                      <Check size={16} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
                      {feature}
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

                <button
                  type="button"
                  onClick={() => setExpanded(isExpanded ? null : plan.name)}
                  aria-expanded={isExpanded}
                  className="mt-4 flex items-center justify-center gap-1 text-xs font-medium text-text-muted hover:text-text-secondary"
                >
                  Full specs
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.dl
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 grid grid-cols-2 gap-3 overflow-hidden border-t border-border pt-3 text-xs"
                    >
                      {Object.entries(plan.specs).map(([key, value]) => (
                        <div key={key}>
                          <dt className="capitalize text-text-muted">{key}</dt>
                          <dd className="font-medium text-text-primary">{value}</dd>
                        </div>
                      ))}
                    </motion.dl>
                  )}
                </AnimatePresence>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
