"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Lightbulb, Rocket, Sparkle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { useCurrency } from "@/components/currency-provider";
import { sharedPlans } from "@/lib/plans";

const stages = [
  {
    icon: Lightbulb,
    label: "Idea",
    blurb: "You're validating, not building yet. Don't overspend on infrastructure for a maybe.",
    planIndex: 0,
    real: true,
  },
  {
    icon: Rocket,
    label: "Prototype",
    blurb: "A working MVP for early users or a demo. Room to iterate without upgrading servers.",
    planIndex: 0,
    real: true,
  },
  {
    icon: TrendingUp,
    label: "Launch",
    blurb: "Real users, real traffic. This is where most founders land.",
    planIndex: 1,
    real: true,
  },
  {
    icon: Building2,
    label: "Scale",
    blurb: "Growing traffic and a small team shipping fast. Priority performance matters now.",
    planIndex: 2,
    real: true,
  },
  {
    icon: Sparkle,
    label: "Enterprise",
    blurb: "Dedicated infrastructure territory — VPS and Cloud Hosting, both on our roadmap.",
    planIndex: 3,
    real: false,
  },
];

export function GrowthTimeline() {
  const [active, setActive] = useState(2);
  const { currency, convertDisplay } = useCurrency();
  const currencySymbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : "€";
  const stage = stages[active];
  const plan = sharedPlans[stage.planIndex];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center">
        {stages.map((s, i) => (
          <div key={s.label} className="flex flex-1 items-center last:flex-initial">
            <button
              type="button"
              onClick={() => setActive(i)}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
                  i === active
                    ? "border-brand-purple bg-brand-purple/10 text-brand-purple"
                    : i < active
                      ? "border-success/50 bg-success/10 text-success"
                      : "border-border-strong text-text-muted"
                }`}
              >
                <s.icon size={20} aria-hidden="true" />
              </div>
              <span
                className={`text-xs font-medium sm:text-sm ${i === active ? "text-brand-purple" : "text-text-secondary"}`}
              >
                {s.label}
              </span>
            </button>
            {i < stages.length - 1 && (
              <div className={`mx-2 h-0.5 flex-1 ${i < active ? "bg-success/40" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      <motion.div
        key={active}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-10 rounded-2xl border border-border-strong bg-card p-6 sm:p-8"
      >
        <p className="max-w-lg text-text-secondary">{stage.blurb}</p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              {stage.real ? "Recommended today" : "Recommended today, until VPS launches"}
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-text-primary">{plan.name}</span>
              <span className="text-sm text-text-muted">
                <AnimatedCounter
                  key={`${plan.name}-${currency}`}
                  value={convertDisplay(plan.monthlyPrice)}
                  prefix={currencySymbol}
                  suffix="/mo"
                />
              </span>
            </div>
          </div>
          <Button href="#compare" size="lg">
            View {plan.name} plan
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
