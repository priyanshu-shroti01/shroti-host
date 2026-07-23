"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Cloud, Globe, Lock, Server, Zap } from "lucide-react";

const STEPS = [
  {
    icon: Globe,
    pending: "Searching domain…",
    done: "Domain available",
    detail: "yourbrand.com",
    duration: 1300,
  },
  {
    icon: Cloud,
    pending: "Configuring DNS…",
    done: "DNS configured",
    detail: "via Cloudflare",
    duration: 1300,
  },
  {
    icon: Server,
    pending: "Provisioning hosting…",
    done: "Hosting ready",
    detail: "LiteSpeed · NVMe",
    duration: 3000,
    hasProgress: true,
  },
  {
    icon: Lock,
    pending: "Installing SSL…",
    done: "SSL installed",
    detail: "Let's Encrypt",
    duration: 1300,
  },
];

const HOLD_DURATION = 2600;

export function HeroDeploy() {
  const [activeStep, setActiveStep] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const isLive = activeStep >= STEPS.length;

  useEffect(() => {
    if (isLive) {
      const resetTimer = setTimeout(() => {
        setActiveStep(0);
        setElapsedMs(0);
      }, HOLD_DURATION);
      return () => clearTimeout(resetTimer);
    }
    const timer = setTimeout(() => {
      setActiveStep((s) => s + 1);
    }, STEPS[activeStep].duration);
    return () => clearTimeout(timer);
  }, [activeStep, isLive]);

  useEffect(() => {
    if (isLive) return;
    const interval = setInterval(() => setElapsedMs((ms) => ms + 60), 60);
    return () => clearInterval(interval);
  }, [activeStep, isLive]);

  const seconds = Math.floor(elapsedMs / 1000);
  const millis = Math.floor((elapsedMs % 1000) / 10);

  return (
    <div className="relative w-full max-w-sm">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-6 -top-6 z-10 hidden items-center gap-2 rounded-full border border-border-strong bg-card px-3 py-2 shadow-lg sm:flex"
      >
        <Cloud size={14} className="text-brand-blue" aria-hidden="true" />
        <span className="text-xs font-medium text-text-secondary">Cloudflare network</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -bottom-5 -right-4 z-10 hidden items-center gap-2 rounded-full border border-border-strong bg-card px-3 py-2 shadow-lg sm:flex"
      >
        <Lock size={14} className="text-success" aria-hidden="true" />
        <span className="text-xs font-medium text-text-secondary">Free SSL</span>
      </motion.div>

      <div className="overflow-hidden rounded-2xl border border-border-strong bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border bg-surface-raised px-5 py-3">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${isLive ? "bg-success" : "bg-warning"}`} />
            <span className="font-mono text-xs text-text-secondary">
              {isLive ? "Website live" : "Deploying"}
            </span>
          </div>
          <span className="font-mono text-xs tabular-nums text-text-muted">
            {seconds}.{millis.toString().padStart(2, "0")}s
          </span>
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
                    {done ? (
                      <Check size={15} aria-hidden="true" />
                    ) : (
                      <step.icon size={15} aria-hidden="true" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium transition-colors duration-300 ${
                        done || active ? "text-text-primary" : "text-text-disabled"
                      }`}
                    >
                      {done ? step.done : step.pending}
                    </p>
                    <p className="truncate font-mono text-xs text-text-muted">{step.detail}</p>
                  </div>
                  {active && !step.hasProgress && (
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
              </div>
            );
          })}

          <div className="flex items-center gap-3 rounded-xl px-2 py-2.5">
            <div
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300 ${
                isLive
                  ? "border-success/40 bg-success/10 text-success"
                  : "border-border text-text-disabled"
              }`}
            >
              <Zap size={15} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-medium transition-colors duration-300 ${
                  isLive ? "text-text-primary" : "text-text-disabled"
                }`}
              >
                {isLive ? "Website live 🚀" : "Website live"}
              </p>
              <p className="truncate font-mono text-xs text-text-muted">yourbrand.com</p>
            </div>
          </div>
        </div>

        <div className="h-1 w-full bg-border">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-purple to-brand-blue"
            animate={{ width: `${(Math.min(activeStep, STEPS.length) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}
