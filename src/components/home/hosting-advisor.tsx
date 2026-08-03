"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { Eyebrow } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sharedPlans } from "@/lib/plans";
import { useCurrency } from "@/components/currency-provider";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { duration, easing } from "@/lib/motion";

const siteCountOptions = [
  { id: "1", label: "Just 1", value: 1 },
  { id: "2-5", label: "2–5", value: 5 },
  { id: "6-10", label: "6–10", value: 10 },
  { id: "10+", label: "More than 10", value: Infinity },
] as const;

const growthOptions = [
  { id: "yes", label: "Yes, expecting to grow soon" },
  { id: "no", label: "Not for now" },
] as const;

const buildOptions = [
  { id: "portfolio", label: "A portfolio or personal site" },
  { id: "business", label: "A business site" },
  { id: "store", label: "An online store" },
] as const;

type Answers = {
  sites?: (typeof siteCountOptions)[number]["id"];
  growth?: (typeof growthOptions)[number]["id"];
  building?: (typeof buildOptions)[number]["id"];
};

const questions = [
  { key: "sites" as const, prompt: "How many websites will you host?", options: siteCountOptions },
  { key: "growth" as const, prompt: "Expecting to add more sites soon?", options: growthOptions },
  { key: "building" as const, prompt: "What are you building?", options: buildOptions },
];

function recommendPlan(answers: Answers) {
  const siteCount = siteCountOptions.find((o) => o.id === answers.sites)?.value ?? 1;
  const baseIndex = sharedPlans.findIndex((p) => siteCount <= p.meters.websites);
  let index = baseIndex === -1 ? sharedPlans.length - 1 : baseIndex;

  if (answers.growth === "yes") {
    index = Math.min(index + 1, sharedPlans.length - 1);
  }

  return sharedPlans[index];
}

export function HostingAdvisor() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const reducedMotion = usePrefersReducedMotion();
  const { format } = useCurrency();

  function selectAnswer(key: keyof Answers, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep((s) => Math.min(s + 1, questions.length));
  }

  function restart() {
    setAnswers({});
    setStep(0);
  }

  const isResult = step >= questions.length;
  const recommended = isResult ? recommendPlan(answers) : null;
  const recommendedIndex = recommended ? sharedPlans.indexOf(recommended) : -1;
  const alternatives = recommended
    ? [sharedPlans[recommendedIndex - 1], sharedPlans[recommendedIndex + 1]].filter((p): p is typeof sharedPlans[number] => Boolean(p))
    : [];

  const siteLabel = siteCountOptions.find((o) => o.id === answers.sites)?.label.toLowerCase();
  const buildLabel = buildOptions.find((o) => o.id === answers.building)?.label.toLowerCase();

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>Hosting Advisor</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Not sure which plan fits?
        </h2>
        <p className="mt-4 text-text-secondary">
          Answer three quick questions and we&apos;ll recommend a plan.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-xl">
        {!isResult && (
          <div className="mb-4 flex items-center justify-center gap-2">
            {questions.map((q, i) => (
              <span
                key={q.key}
                className={`h-1.5 w-8 rounded-full transition-colors ${
                  i <= step ? "bg-brand-purple" : "bg-border"
                }`}
                aria-hidden="true"
              />
            ))}
            <span className="ml-2 text-xs text-text-muted">
              Step {step + 1} of {questions.length}
            </span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!isResult ? (
            <motion.div
              key={step}
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: reducedMotion ? 0 : duration.card, ease: easing.outCubic }}
              className="rounded-2xl border border-border bg-card p-8"
            >
              <h3 className="text-lg font-semibold text-text-primary">{questions[step].prompt}</h3>
              <div className="mt-5 space-y-2.5">
                {questions[step].options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => selectAnswer(questions[step].key, option.id)}
                    className="group flex w-full items-center justify-between rounded-xl border border-border px-5 py-3.5 text-left text-sm font-medium text-text-primary transition-colors hover:border-brand-purple hover:text-brand-purple"
                  >
                    {option.label}
                    <ArrowRight
                      size={16}
                      className="text-text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand-purple"
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            recommended && (
              <motion.div
                key="result"
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : duration.card, ease: easing.outCubic }}
                aria-live="polite"
              >
                <SpotlightCard>
                  <div className="p-8">
                    <Badge tone="purple">Recommended for you</Badge>
                    <h3 className="mt-4 text-2xl font-semibold text-text-primary">{recommended.name}</h3>
                    <p className="mt-1 text-sm text-text-muted">{recommended.tagline}</p>

                    <div className="mt-5 flex items-baseline gap-1">
                      <span className="text-3xl font-semibold text-text-primary">
                        {format(recommended.monthlyPrice)}
                      </span>
                      <span className="text-sm text-text-muted">/mo</span>
                    </div>

                    <ul className="mt-6 space-y-2">
                      {recommended.features.slice(0, 3).map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-text-secondary">
                          <Check size={14} className="text-success" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <p className="mt-6 text-sm text-text-secondary">
                      Because you&apos;re building {buildLabel ?? "a new site"} and need room for{" "}
                      {siteLabel ?? "your sites"} website{siteLabel === "just 1" ? "" : "s"}, {recommended.name}{" "}
                      gives you {recommended.specs.storage} and {recommended.specs.support.toLowerCase()}.
                    </p>

                    {alternatives.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1 border-t border-border pt-4">
                        <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
                          Also consider
                        </span>
                        {alternatives.map((plan) => (
                          <a
                            key={plan.name}
                            href="/hosting"
                            className="text-sm font-medium text-brand-purple hover:underline"
                          >
                            {plan.name} — {format(plan.monthlyPrice)}/mo
                          </a>
                        ))}
                      </div>
                    )}

                    <div className="mt-8 flex flex-wrap gap-3">
                      <Button href="#compare" size="lg">
                        See {recommended.name} pricing
                      </Button>
                      <Button href="/hosting" variant="secondary" size="lg">
                        Compare all plans
                      </Button>
                      <Button type="button" variant="ghost" onClick={restart}>
                        <RotateCcw size={14} aria-hidden="true" />
                        Restart
                      </Button>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
