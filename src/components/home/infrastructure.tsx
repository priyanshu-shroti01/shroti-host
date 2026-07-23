"use client";

import { motion } from "framer-motion";
import { Cloud, Globe, HardDrive, Monitor, Shield, Zap } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section";

const flow = [
  {
    icon: Globe,
    title: "Internet",
    description: "Your visitor's request begins here.",
  },
  {
    icon: Cloud,
    title: "Cloudflare",
    description: "Global network for DNS, CDN caching, and DDoS protection.",
  },
  {
    icon: Zap,
    title: "LiteSpeed Web Server",
    description: "Event-driven request handling, far faster than Apache.",
  },
  {
    icon: Shield,
    title: "CloudLinux Isolation",
    description: "Your account runs isolated — one site's spike never slows another.",
  },
  {
    icon: Monitor,
    title: "Your Website",
    description: "Served from NVMe storage with daily backups and Imunify360 security.",
  },
];

export function Infrastructure() {
  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>Infrastructure</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          What&apos;s actually running under your website.
        </h2>
        <p className="mt-4 text-text-secondary">
          No vague marketing terms — here&apos;s the real path a request takes, layer by layer.
        </p>
      </div>

      <div className="relative mx-auto mt-14 max-w-md">
        <div className="absolute bottom-8 left-6 top-8 w-px bg-border" aria-hidden="true">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
            className="h-full w-full bg-gradient-to-b from-brand-purple to-brand-blue"
          />
          {[0, 2.6, 5.2].map((delay, i) => (
            <span
              key={i}
              className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-brand-blue shadow-[0_0_8px_2px_rgb(63_167_255/0.6)]"
              style={{ animation: "packet-travel 3.6s linear infinite", animationDelay: `${delay}s` }}
            />
          ))}
        </div>

        <div className="space-y-3">
          {flow.map((layer, i) => (
            <Reveal key={layer.title} delay={i * 0.1}>
              <div className="relative flex gap-4 rounded-2xl border border-border bg-card p-5">
                <div className="relative z-10 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border-strong bg-surface-raised text-brand-purple">
                  <layer.icon size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">{layer.title}</h3>
                  <p className="mt-1 text-sm text-text-secondary">{layer.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-md items-center gap-3 rounded-xl border border-dashed border-border-strong p-4 text-sm text-text-muted">
        <HardDrive size={18} className="shrink-0" aria-hidden="true" />
        All storage runs on NVMe SSDs with automatic daily backups.
      </div>
    </div>
  );
}
