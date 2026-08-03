"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, Database, HardDrive, Mail, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { useCurrency } from "@/components/currency-provider";
import { sharedPlans } from "@/lib/plans";

const storageOptions = [
  { label: "10 GB", value: 10 },
  { label: "50 GB", value: 50 },
  { label: "150 GB", value: 150 },
];

const trafficOptions = [
  { label: "Under 5,000 / mo", tier: 0 },
  { label: "5,000 – 50,000 / mo", tier: 1 },
  { label: "50,000+ / mo", tier: 2 },
];

const emailOptions = [
  { label: "1 mailbox", tier: 0 },
  { label: "Up to 10", tier: 1 },
  { label: "Unlimited", tier: 2 },
];

const phpVersions = ["7.4", "8.1", "8.3"];
const databaseOptions = ["1–5", "6–15", "Unlimited"];

const loadByTier = [28, 58, 88];
const bandwidthBarsByTier = [
  [20, 35, 25, 40, 30],
  [40, 65, 55, 75, 60],
  [70, 90, 100, 85, 95],
];

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
        active
          ? "border-brand-purple bg-brand-purple/10 text-brand-purple"
          : "border-border text-text-secondary hover:border-border-strong hover:text-text-primary"
      }`}
    >
      {label}
    </button>
  );
}

export function HostingConfigurator() {
  const [storage, setStorage] = useState(storageOptions[1].value);
  const [trafficTier, setTrafficTier] = useState(1);
  const [emailTier, setEmailTier] = useState(1);
  const [php, setPhp] = useState(phpVersions[2]);
  const [nodeEnabled, setNodeEnabled] = useState(true);
  const [databases, setDatabases] = useState(databaseOptions[0]);
  const { currency, convertDisplay } = useCurrency();
  const currencySymbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : "€";

  const storageTier = storageOptions.findIndex((s) => s.value === storage);
  const recommendedTier = Math.max(storageTier, trafficTier, emailTier);
  const plan = sharedPlans[recommendedTier];

  const storagePercent = Math.round((storage / 150) * 100);
  const loadPercent = loadByTier[recommendedTier];
  const bars = useMemo(() => bandwidthBarsByTier[trafficTier], [trafficTier]);

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Configure your hosting.
        </h2>
        <p className="mt-4 text-text-secondary">
          Tell us what you need — we&apos;ll match it to the right plan, live.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <div>
            <p className="text-sm font-medium text-text-primary">Storage</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {storageOptions.map((s) => (
                <Chip key={s.value} label={s.label} active={storage === s.value} onClick={() => setStorage(s.value)} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-text-primary">Expected traffic</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {trafficOptions.map((t) => (
                <Chip key={t.label} label={t.label} active={trafficTier === t.tier} onClick={() => setTrafficTier(t.tier)} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-text-primary">Email accounts</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {emailOptions.map((e) => (
                <Chip key={e.label} label={e.label} active={emailTier === e.tier} onClick={() => setEmailTier(e.tier)} />
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-text-primary">PHP version</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {phpVersions.map((v) => (
                  <Chip key={v} label={v} active={php === v} onClick={() => setPhp(v)} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">MySQL databases</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {databaseOptions.map((d) => (
                  <Chip key={d} label={d} active={databases === d} onClick={() => setDatabases(d)} />
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-text-primary">Node.js support</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <Chip label="Enabled" active={nodeEnabled} onClick={() => setNodeEnabled(true)} />
              <Chip label="Not needed" active={!nodeEnabled} onClick={() => setNodeEnabled(false)} />
            </div>
          </div>

          <p className="text-xs text-text-muted">
            PHP version, databases, and Node.js are available on every plan — they don&apos;t change
            your recommendation, only your server config below.
          </p>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-2xl border border-border-strong bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server size={14} className="text-brand-purple" aria-hidden="true" />
                  <span className="font-mono text-xs text-text-secondary">Configuration preview</span>
                </div>
                <Badge tone="neutral">Simulated</Badge>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 text-text-secondary">
                      <Cpu size={12} aria-hidden="true" />
                      Estimated headroom
                    </span>
                    <span className="font-medium text-text-primary">{loadPercent}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-blue"
                      animate={{ width: `${loadPercent}%` }}
                      transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 text-text-secondary">
                      <HardDrive size={12} aria-hidden="true" />
                      Storage
                    </span>
                    <span className="font-medium text-text-primary">{storage} GB</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border">
                    <motion.div
                      className="h-full rounded-full bg-brand-blue"
                      animate={{ width: `${storagePercent}%` }}
                      transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                    />
                  </div>
                </div>

                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary">
                    <Database size={12} aria-hidden="true" />
                    Traffic pattern at this tier
                  </span>
                  <div className="mt-2 flex h-10 items-end gap-1.5">
                    {bars.map((h, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 rounded-t bg-gradient-to-t from-brand-purple to-brand-blue"
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.4, delay: i * 0.04, ease: [0.33, 1, 0.68, 1] }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 border-t border-border pt-3 text-xs text-text-muted">
                  <span className="rounded-full border border-border px-2 py-1 font-mono">PHP {php}</span>
                  <span className="rounded-full border border-border px-2 py-1 font-mono">
                    Node.js {nodeEnabled ? "on" : "off"}
                  </span>
                  <span className="rounded-full border border-border px-2 py-1 font-mono">{databases} DBs</span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1 font-mono">
                    <Mail size={10} aria-hidden="true" />
                    {emailOptions[emailTier].label}
                  </span>
                </div>
              </div>
            </div>

            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-brand-purple/40 bg-brand-purple/5 p-5"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-brand-purple">Matches</p>
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
              <Button href="#compare" size="lg" className="mt-4 w-full">
                View {plan.name} plan
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
