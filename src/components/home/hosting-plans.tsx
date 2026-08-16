"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightLeft, BadgeCheck, Check, MessageCircle, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { Tilt3D } from "@/components/ui/tilt-3d";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { sharedPlans, cycleMonths, savePercent, type Cycle, type Plan } from "@/lib/plans";
import { formatPrice } from "@/lib/currency";
import { storeGroups } from "@/lib/whmcs";
import { useCurrency } from "@/components/currency-provider";

const cycleLabels: Record<Cycle, string> = {
  monthly: "Monthly",
  quarterly: "3 Months",
  semiAnnual: "6 Months",
  annual: "Annual",
};

export function HostingPlans({
  plans = sharedPlans,
  orderUrl = storeGroups.shared,
}: {
  plans?: Plan[];
  /** WHMCS store URL the "Choose <plan>" buttons send shoppers to. */
  orderUrl?: string;
}) {
  // Monthly by default — the entry price is the anchor that converts;
  // annual totals read 12x more expensive at first glance.
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const { currency, convertDisplay } = useCurrency();
  const currencySymbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : "€";

  return (
    <div id="compare">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Simple,{" "}
          <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">honest</span>{" "}
          pricing
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
              aria-pressed={cycle === c}
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
            <Reveal key={plan.name} delay={i * 0.08} className={`h-full ${plan.recommended ? "lg:scale-105" : ""}`}>
              <div data-theme={plan.recommended ? "dark" : undefined} className="h-full">
              {/* One spatial hover effect only: the documented Tilt3D vocabulary.
                  No stacked lift/pop — see docs/micro-interactions.md "3D tilt". */}
              <Tilt3D maxTilt={3} className="h-full" innerClassName="h-full">
              <Card
                className={`flex h-full flex-col ${
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
                    {formatPrice(regularTotal, currency)}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-xs text-text-muted">Billed {cycleLabels[cycle].toLowerCase()} · excl. taxes</p>
                  <Badge tone="success" className="text-[10px]">
                    Save {save}%
                  </Badge>
                </div>
                {/* The renewal number is the industry's favorite hiding place —
                    printing it here is the whole trust play. */}
                <p className="mt-1.5 text-xs font-medium text-success">
                  Renews at the same price — no increase later
                </p>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-text-secondary">
                      <Check size={16} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  href={orderUrl}
                  variant={plan.recommended ? "primary" : "secondary"}
                  size="lg"
                  className="mt-8 w-full"
                >
                  Choose {plan.name}
                </Button>
                <p className="mt-3 text-center text-xs text-text-muted">
                  Secure checkout · UPI, cards &amp; net banking
                </p>
              </Card>
              </Tilt3D>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Assurance strip — every claim here is one the plans (or the refund
          policy) actually make; this row just puts them at the decision point. */}
      <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <Link
          href="/legal/refund-policy"
          className="inline-flex items-center gap-2 text-sm text-text-secondary underline-offset-2 hover:text-text-primary hover:underline"
        >
          <ShieldCheck size={15} className="shrink-0 text-success" aria-hidden="true" />
          7-day money-back guarantee
        </Link>
        {[
          { icon: BadgeCheck, label: "Same renewal price, every cycle" },
          { icon: ArrowRightLeft, label: "Free migration, handled for you" },
          { icon: Zap, label: "Instant activation" },
          { icon: MessageCircle, label: "24/7 priority support" },
        ].map((item) => (
          <span key={item.label} className="inline-flex items-center gap-2 text-sm text-text-secondary">
            <item.icon size={15} className="shrink-0 text-success" aria-hidden="true" />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
