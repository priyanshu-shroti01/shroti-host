"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, Check, Globe2, Rocket, ShoppingBag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ResourceMeter } from "@/components/ui/resource-meter";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { useCurrency } from "@/components/currency-provider";
import { plans } from "@/lib/plans";

type BuildingType = "portfolio" | "blog" | "business" | "store" | "saas";
type Traffic = "starting" | "growing" | "high";

const buildingOptions: { id: BuildingType; label: string; icon: typeof Globe2; score: number }[] = [
  { id: "portfolio", label: "Portfolio", icon: Sparkles, score: 0 },
  { id: "blog", label: "Blog", icon: Globe2, score: 0 },
  { id: "business", label: "Business site", icon: Briefcase, score: 1 },
  { id: "store", label: "Online store", icon: ShoppingBag, score: 2 },
  { id: "saas", label: "SaaS / app", icon: Rocket, score: 2 },
];

const trafficOptions: { id: Traffic; label: string; hint: string; score: number }[] = [
  { id: "starting", label: "Just starting", hint: "< 1,000 visits / mo", score: 0 },
  { id: "growing", label: "Growing", hint: "1K – 20K visits / mo", score: 1 },
  { id: "high", label: "High traffic", hint: "20K+ visits / mo", score: 2 },
];

function planForScore(score: number) {
  if (score >= 4) return plans[2];
  if (score >= 2) return plans[1];
  return plans[0];
}

function reasonFor(building: BuildingType | null, traffic: Traffic | null) {
  if (!building || !traffic) return null;
  if (building === "store" || building === "saas") {
    return traffic === "high"
      ? "Stores and apps at real traffic need headroom before it becomes a problem."
      : "Room to grow without a mid-launch plan change.";
  }
  if (building === "business") return "Enough capacity for a business site with room to add pages.";
  return traffic === "starting"
    ? "A portfolio or blog just starting out doesn't need to pay for headroom it won't use yet."
    : "More room as your audience grows.";
}

export function HostingAdvisor() {
  const [building, setBuilding] = useState<BuildingType | null>(null);
  const [traffic, setTraffic] = useState<Traffic | null>(null);
  const { currency, convertDisplay } = useCurrency();
  const currencySymbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : "€";

  const score = useMemo(() => {
    const b = buildingOptions.find((o) => o.id === building)?.score ?? 0;
    const t = trafficOptions.find((o) => o.id === traffic)?.score ?? 0;
    return b + t;
  }, [building, traffic]);

  const answered = building !== null && traffic !== null;
  const recommended = planForScore(score);
  const reason = reasonFor(building, traffic);

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>Hosting Advisor</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Not sure which plan? Answer two questions.
        </h2>
        <p className="mt-4 text-text-secondary">
          The recommendation updates as you answer — no account, no quiz to submit.
        </p>
      </div>

      <Reveal delay={0.1}>
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            <div>
              <p className="text-sm font-medium text-text-primary">What are you building?</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {buildingOptions.map((opt) => {
                  const selected = building === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setBuilding(opt.id)}
                      aria-pressed={selected}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                        selected
                          ? "border-brand-purple bg-brand-purple/10 text-brand-purple"
                          : "border-border text-text-secondary hover:border-border-strong hover:text-text-primary"
                      }`}
                    >
                      <opt.icon size={16} className="shrink-0" aria-hidden="true" />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-text-primary">Expected traffic?</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {trafficOptions.map((opt) => {
                  const selected = traffic === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setTraffic(opt.id)}
                      aria-pressed={selected}
                      className={`rounded-xl border px-3 py-2.5 text-left transition-all duration-200 ${
                        selected
                          ? "border-brand-purple bg-brand-purple/10"
                          : "border-border hover:border-border-strong"
                      }`}
                    >
                      <span
                        className={`block text-sm font-medium ${selected ? "text-brand-purple" : "text-text-secondary"}`}
                      >
                        {opt.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-text-muted">{opt.hint}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-2xl border border-border-strong bg-card p-6">
              <AnimatePresence mode="wait">
                {!answered ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full min-h-[13rem] flex-col items-center justify-center gap-2 text-center"
                  >
                    <span className="text-2xl" aria-hidden="true">
                      👋
                    </span>
                    <p className="text-sm text-text-muted">
                      Answer both questions to see your recommendation.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={recommended.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-brand-purple">
                      Recommended for you
                    </p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <h3 className="text-2xl font-semibold text-text-primary">{recommended.name}</h3>
                      <span className="text-sm text-text-muted">
                        <AnimatedCounter
                          key={`${recommended.name}-${currency}`}
                          value={convertDisplay(recommended.annualPrice)}
                          prefix={currencySymbol}
                          suffix="/mo"
                        />
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-text-secondary">{reason}</p>

                    <div className="mt-5 space-y-3 border-t border-border pt-4">
                      <ResourceMeter
                        label="Websites"
                        valueLabel={recommended.specs.websites}
                        value={recommended.meters.websites}
                        max={Math.max(...plans.map((p) => p.meters.websites).filter(Number.isFinite))}
                        emphasis
                      />
                      <ResourceMeter
                        label="Storage"
                        valueLabel={recommended.specs.storage}
                        value={recommended.meters.storageGB}
                        max={Math.max(...plans.map((p) => p.meters.storageGB))}
                        delay={0.06}
                        emphasis
                      />
                    </div>

                    <Button href="/hosting" size="lg" className="mt-6 w-full">
                      Choose {recommended.name}
                    </Button>
                    <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-text-muted">
                      <Check size={12} className="text-success" aria-hidden="true" />
                      No commitment — switch plans anytime
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
