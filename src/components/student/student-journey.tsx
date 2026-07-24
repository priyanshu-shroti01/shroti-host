"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, GraduationCap, Palette, PartyPopper, Rocket, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: ShieldCheck,
    title: "Verify you're a student",
    body: "Sign up with your .edu (or equivalent) email, or upload a student ID — verified in minutes.",
  },
  {
    icon: Palette,
    title: "Choose your project",
    body: "Portfolio, class project, a startup idea — pick what you're building first.",
  },
  {
    icon: GraduationCap,
    title: "Your discount unlocks",
    body: "Student pricing applies automatically. Free launch subdomain included, no domain required.",
  },
  {
    icon: Rocket,
    title: "Deploy",
    body: "One click and your first site is live — LiteSpeed, free SSL, daily backups included.",
  },
];

export function StudentJourney() {
  const [step, setStep] = useState(0);
  const done = step >= steps.length;
  const StepIcon = steps[Math.min(step, steps.length - 1)].icon;

  function next() {
    setStep((s) => Math.min(s + 1, steps.length));
  }

  function restart() {
    setStep(0);
  }

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-border-strong bg-card p-8 text-center sm:p-10">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="celebrate"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, -8, 0] }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-purple/10 text-brand-purple"
            >
              <PartyPopper size={28} aria-hidden="true" />
            </motion.div>
            <h3 className="mt-4 text-2xl font-semibold text-text-primary">Your site is live.</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm text-text-secondary">
              That&apos;s the whole journey — verify, build, deploy. Ready to actually do it?
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button href="https://portal.shrotihost.in/submitticket.php" size="lg">
                Apply for student pricing
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
              <Button variant="secondary" size="lg" onClick={restart}>
                Watch again
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
          >
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-purple/10 text-brand-purple">
              <StepIcon size={28} aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-text-primary">{steps[step].title}</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm text-text-secondary">{steps[step].body}</p>
            <Button size="lg" className="mt-6" onClick={next}>
              {step === steps.length - 1 ? "Deploy" : "Continue"}
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-center gap-2">
        {steps.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === step && !done ? "w-6 bg-brand-purple" : i < step || done ? "w-1.5 bg-success" : "w-1.5 bg-border"
            }`}
          />
        ))}
        <Check size={12} className={done ? "text-success" : "text-border"} aria-hidden="true" />
      </div>
    </div>
  );
}
