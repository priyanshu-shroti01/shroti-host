"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Cloud, Globe, Lock, Server, Zap } from "lucide-react";

const DEFAULT_DOMAIN = "yourbrand.com";

function buildSteps(domain: string) {
  return [
    {
      icon: Globe,
      pending: "Checking domain…",
      done: "Domain available",
      detail: domain,
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
}

const HOLD_DURATION = 2600;

function sanitizeDomain(raw: string): string {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/[^a-z0-9.-]/g, "");
  if (!cleaned) return DEFAULT_DOMAIN;
  return cleaned.includes(".") ? cleaned : `${cleaned}.com`;
}

export function HeroDeploy() {
  const [domainInput, setDomainInput] = useState("");
  const [activeDomain, setActiveDomain] = useState(DEFAULT_DOMAIN);
  const [activeStep, setActiveStep] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const steps = buildSteps(activeDomain);
  const isLive = activeStep >= steps.length;

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
    }, steps[activeStep].duration);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep, isLive, activeDomain]);

  useEffect(() => {
    if (isLive) return;
    const interval = setInterval(() => setElapsedMs((ms) => ms + 60), 60);
    return () => clearInterval(interval);
  }, [activeStep, isLive]);

  function handleDeploy(e: FormEvent) {
    e.preventDefault();
    setActiveDomain(sanitizeDomain(domainInput));
    setActiveStep(0);
    setElapsedMs(0);
    inputRef.current?.blur();
  }

  const seconds = Math.floor(elapsedMs / 1000);
  const millis = Math.floor((elapsedMs % 1000) / 10);

  const dnsActive = activeStep === 1;
  const dnsDone = activeStep > 1 || isLive;
  const sslActive = activeStep === 3;
  const sslDone = isLive;

  return (
    <div className="relative w-full max-w-sm">
      <motion.div
        initial={false}
        animate={
          dnsActive
            ? { opacity: 1, scale: 1.04, y: -2 }
            : dnsDone
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 0.45, scale: 1, y: 0 }
        }
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`absolute -left-6 -top-6 z-10 hidden items-center gap-2 rounded-full border bg-card px-3 py-2 shadow-lg sm:flex ${
          dnsActive ? "border-brand-blue/60" : "border-border-strong"
        }`}
      >
        <Cloud size={14} className={dnsDone ? "text-success" : "text-brand-blue"} aria-hidden="true" />
        <span className="text-xs font-medium text-text-secondary">
          {dnsDone ? "Routed via Cloudflare" : "Configuring DNS…"}
        </span>
      </motion.div>

      <motion.div
        initial={false}
        animate={
          sslActive
            ? { opacity: 1, scale: 1.04, y: 2 }
            : sslDone
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 0.45, scale: 1, y: 0 }
        }
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`absolute -bottom-5 -right-4 z-10 hidden items-center gap-2 rounded-full border bg-card px-3 py-2 shadow-lg sm:flex ${
          sslActive ? "border-success/60" : "border-border-strong"
        }`}
      >
        <Lock size={14} className="text-success" aria-hidden="true" />
        <span className="text-xs font-medium text-text-secondary">
          {sslDone ? "Secured — SSL active" : "Free SSL"}
        </span>
      </motion.div>

      <div className="overflow-hidden rounded-2xl border border-border-strong bg-card shadow-2xl">
        <form onSubmit={handleDeploy} className="flex items-center gap-2 border-b border-border p-3">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
            <Globe size={13} className="shrink-0 text-text-muted" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="type your domain…"
              aria-label="Domain name"
              className="w-full min-w-0 bg-transparent font-mono text-xs text-text-primary placeholder:text-text-muted focus:outline-none"
            />
          </div>
          <button
            type="submit"
            aria-label="Deploy this domain"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-purple text-white transition-transform duration-150 hover:scale-105 active:scale-95"
          >
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        </form>

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
          {steps.map((step, i) => {
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
                Website live
              </p>
              <p className="truncate font-mono text-xs text-text-muted">{activeDomain}</p>
            </div>
          </div>
        </div>

        <div className="h-1 w-full bg-border">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-purple to-brand-blue"
            animate={{ width: `${(Math.min(activeStep, steps.length) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}
