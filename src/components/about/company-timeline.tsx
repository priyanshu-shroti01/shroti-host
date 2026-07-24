"use client";

import { motion } from "framer-motion";
import { Bot, Cloud, Rocket, Sprout } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const milestones = [
  {
    year: "2023",
    icon: Sprout,
    title: "ShrotiHost founded",
    body: "Started with a simple idea: hosting shouldn't be complicated or overpriced.",
    status: "done" as const,
  },
  {
    year: "2023 – 2025",
    icon: Rocket,
    title: "Growing with real customers",
    body: "Students, freelancers, and small businesses launched on ShrotiHost — reviews and all.",
    status: "done" as const,
  },
  {
    year: "2026",
    icon: Sprout,
    title: "Platform rebuild",
    body: "A complete redesign — the site you're looking at right now.",
    status: "active" as const,
  },
  {
    year: "Next",
    icon: Cloud,
    title: "VPS & Cloud Hosting",
    body: "Dedicated infrastructure for teams that outgrow shared hosting.",
    status: "future" as const,
  },
  {
    year: "Later",
    icon: Bot,
    title: "AI Hosting Advisor",
    body: "Smarter guidance for choosing and managing hosting — built on real usage patterns.",
    status: "future" as const,
  },
];

export function CompanyTimeline() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="relative">
        <div className="absolute bottom-6 left-6 top-6 w-px bg-border" aria-hidden="true" />
        <div className="space-y-8">
          {milestones.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="relative flex gap-5"
            >
              <div
                className={`relative z-10 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 ${
                  m.status === "future"
                    ? "border-dashed border-border-strong bg-bg text-text-muted"
                    : m.status === "active"
                      ? "border-brand-purple bg-brand-purple/10 text-brand-purple"
                      : "border-success/50 bg-success/10 text-success"
                }`}
              >
                <m.icon size={18} aria-hidden="true" />
              </div>
              <div className="pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-text-muted">{m.year}</span>
                  {m.status === "active" && <Badge tone="purple">You are here</Badge>}
                  {m.status === "future" && <Badge tone="neutral">Planned</Badge>}
                </div>
                <h3 className="mt-1 text-lg font-semibold text-text-primary">{m.title}</h3>
                <p className="mt-1 text-sm text-text-secondary">{m.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
