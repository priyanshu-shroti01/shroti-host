"use client";

import { motion } from "framer-motion";
import { Activity, Check, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const services = [
  "API",
  "DNS",
  "Email",
  "Network",
  "Storage",
  "Database",
  "Billing",
];

const uptimeBars = [98, 100, 100, 97, 100, 100, 99, 100, 100, 100, 96, 100, 100, 100];

export function StatusBoard() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-border-strong bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-brand-purple" aria-hidden="true" />
            <p className="text-sm font-semibold text-text-primary">Service status</p>
          </div>
          <Badge tone="neutral">Preview — not live monitoring yet</Badge>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {services.map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
            >
              <span className="text-sm text-text-primary">{s}</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
                Operational
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
            Uptime — last 14 days (example)
          </p>
          <div className="mt-3 flex h-12 items-end gap-1">
            {uptimeBars.map((v, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${v}%` }}
                viewport={{ once: true, margin: "0px" }}
                transition={{ duration: 0.4, delay: i * 0.02 }}
                className={`flex-1 rounded-sm ${v < 98 ? "bg-warning" : "bg-success"}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-xl border border-dashed border-border-strong p-4 text-sm text-text-muted">
          <Clock size={15} className="shrink-0" aria-hidden="true" />
          No incidents in this example timeline. Live incident history ships with real-time
          monitoring.
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-text-muted">
        <Check size={13} className="text-success" aria-hidden="true" />
        Experiencing an actual issue? Contact support — this page is a design preview, not a
        live feed.
      </div>
    </div>
  );
}
