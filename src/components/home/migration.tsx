"use client";

import { motion } from "framer-motion";
import { Check, Database, FileArchive, Globe, Mail, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const files = [
  { icon: Database, label: "Database", delay: 0 },
  { icon: FileArchive, label: "Files", delay: 1.8 },
  { icon: Mail, label: "Email", delay: 3.6 },
];

const LANE_DURATION = 5.4;

const steps = [
  "Tell us your current host",
  "We copy files, databases, and email",
  "You verify, then we switch DNS",
];

export function Migration({ ctaHref = "/migration" }: { ctaHref?: string }) {
  return (
    <Reveal>
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>Free Migration</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Move Your Website Without the Stress
        </h2>
        <p className="mt-4 text-text-secondary">
          Free migration from any host. Minimal downtime.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-3xl rounded-3xl border border-border bg-card p-6 sm:p-10">
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex w-24 shrink-0 flex-col items-center gap-2 text-center sm:w-32">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border-strong bg-surface text-text-muted">
              <Globe size={20} aria-hidden="true" />
            </div>
            <span className="text-xs font-medium text-text-secondary">Your current host</span>
          </div>

          <div className="relative h-14 flex-1 overflow-hidden">
            <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-border" aria-hidden="true" />
            {files.map((file) => (
              <motion.div
                key={file.label}
                className="absolute top-1/2 flex -translate-y-1/2 items-center gap-1 whitespace-nowrap rounded-full border border-border-strong bg-surface-raised px-2 py-1 text-[11px] font-medium text-text-secondary shadow-sm"
                style={{ left: 0 }}
                animate={{ left: ["2%", "84%"], opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: LANE_DURATION,
                  delay: file.delay,
                  repeat: Infinity,
                  ease: "linear",
                  times: [0, 0.1, 0.82, 1],
                }}
                aria-hidden="true"
              >
                <file.icon size={12} className="text-brand-purple" aria-hidden="true" />
                {file.label}
              </motion.div>
            ))}
          </div>

          <div className="flex w-24 shrink-0 flex-col items-center gap-2 text-center sm:w-32">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-purple/50 bg-brand-purple/10 text-brand-purple">
              <Server size={20} aria-hidden="true" />
            </div>
            <span className="text-xs font-medium text-text-primary">ShrotiHost</span>
          </div>
        </div>

        <ol className="mt-8 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between sm:gap-6">
          {steps.map((step, i) => (
            <li key={step} className="flex items-center gap-2.5 text-sm text-text-secondary sm:flex-1">
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-purple/10 text-[11px] font-semibold text-brand-purple">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-text-muted">
        <Check size={14} className="text-success" aria-hidden="true" />
        Typical downtime: under 15 minutes, scheduled at your convenience.
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button href={ctaHref} size="lg">
          Request Free Migration
        </Button>
        <Button href="#compare" variant="secondary" size="lg">
          View Hosting Plans
        </Button>
      </div>
    </Reveal>
  );
}
