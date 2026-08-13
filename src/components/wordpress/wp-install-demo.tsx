"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Download, Lock, Palette, Puzzle, Zap } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const themes = [
  { name: "Editorial", from: "from-brand-purple/60", to: "to-brand-blue/40" },
  { name: "Storefront", from: "from-brand-blue/60", to: "to-success/30" },
  { name: "Minimal", from: "from-success/50", to: "to-brand-purple/30" },
  { name: "Agency", from: "from-warning/50", to: "to-brand-purple/40" },
];

const STEPS = [
  { icon: Download, pending: "Installing WordPress…", done: "WordPress installed", duration: 1300 },
  { icon: Palette, pending: "Choosing a theme…", done: "Theme applied", duration: 1800, showThemes: true },
  { icon: Puzzle, pending: "Installing plugins…", done: "Plugins installed", duration: 2400, hasProgress: true },
  { icon: Lock, pending: "Configuring SSL…", done: "SSL secured", duration: 1200 },
  { icon: Zap, pending: "Enabling LiteSpeed Cache…", done: "Cache active", duration: 1200 },
];

const HOLD_DURATION = 2600;

export function WpInstallDemo() {
  const reducedMotion = usePrefersReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const [themeIndex, setThemeIndex] = useState(0);
  const isLive = activeStep >= STEPS.length;

  // Reduced motion: hold the finished state instead of looping the install
  // forever (same short-circuit as the homepage hero's deploy demo).
  useEffect(() => {
    if (reducedMotion) {
      // One-time environment sync, not a render-driven update.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveStep(STEPS.length);
      return;
    }
    if (isLive) {
      const t = setTimeout(() => setActiveStep(0), HOLD_DURATION);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setActiveStep((s) => s + 1), STEPS[activeStep].duration);
    return () => clearTimeout(t);
  }, [activeStep, isLive, reducedMotion]);

  useEffect(() => {
    if (activeStep !== 1 || reducedMotion) return;
    const interval = setInterval(() => setThemeIndex((i) => (i + 1) % themes.length), 350);
    return () => clearInterval(interval);
  }, [activeStep, reducedMotion]);

  return (
    <div className="mx-auto max-w-lg overflow-hidden rounded-2xl border border-border-strong bg-card shadow-2xl">
      <div className="flex items-center justify-between border-b border-border bg-surface-raised px-5 py-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${isLive ? "bg-success" : "bg-warning"}`} />
          <span className="font-mono text-xs text-text-secondary">
            {isLive ? "Site ready" : "Setting up WordPress"}
          </span>
        </div>
        <span className="font-mono text-xs text-text-muted">yourbrand.com/wp-admin</span>
      </div>

      <div className="space-y-1 p-5">
        {STEPS.map((step, i) => {
          const done = i < activeStep || isLive;
          const active = i === activeStep && !isLive;
          return (
            <div key={step.pending} className="rounded-xl px-2 py-2.5">
              <div className="flex items-center gap-3">
                <div
                  className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300 ${
                    done
                      ? "border-success/40 bg-success/10 text-success"
                      : active
                        ? "border-brand-purple/50 bg-brand-purple/10 text-brand-purple"
                        : "border-border text-text-disabled"
                  }`}
                >
                  {done ? <Check size={15} aria-hidden="true" /> : <step.icon size={15} aria-hidden="true" />}
                </div>
                <p
                  className={`flex-1 text-sm font-medium transition-colors duration-300 ${
                    done || active ? "text-text-primary" : "text-text-disabled"
                  }`}
                >
                  {done ? step.done : step.pending}
                </p>
                {active && !step.hasProgress && !step.showThemes && (
                  <motion.span
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-purple"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </div>

              {active && step.hasProgress && (
                <div className="ml-11 mt-2 h-1 overflow-hidden rounded-full bg-border">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-blue"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: step.duration / 1000, ease: "linear" }}
                  />
                </div>
              )}

              {active && step.showThemes && (
                <div className="ml-11 mt-2 flex gap-2">
                  {themes.map((theme, ti) => (
                    <div
                      key={theme.name}
                      className={`h-10 flex-1 rounded-lg bg-gradient-to-br ${theme.from} ${theme.to} border-2 transition-all duration-200 ${
                        ti === themeIndex ? "border-brand-purple scale-105" : "border-transparent opacity-50"
                      }`}
                    />
                  ))}
                </div>
              )}
              {done && i === 1 && (
                <p className="ml-11 mt-1 font-mono text-xs text-text-muted">{themes[themeIndex].name}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="h-1 w-full bg-border">
        <motion.div
          className="h-full bg-gradient-to-r from-brand-purple to-brand-blue"
          animate={{ width: `${(Math.min(activeStep, STEPS.length) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
