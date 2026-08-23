"use client";

import { motion } from "framer-motion";
import { Activity, Clock, Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * Manual notice board — not a monitor. The service list is a hand-maintained
 * statement of what ShrotiHost runs; incidents are posted here by the team.
 * There is deliberately no uptime chart: a fabricated one was removed in the
 * 2026-08 audit, and nothing numeric ships here until a real feed exists.
 */
const services = [
  "API",
  "DNS",
  "Email",
  "Network",
  "Storage",
  "Database",
  "Billing",
];

export function StatusBoard() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-border-strong bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-brand-purple" aria-hidden="true" />
            <p className="text-sm font-semibold text-text-primary">Service status</p>
          </div>
          <Badge tone="neutral">Manual notice board — not live monitoring</Badge>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {services.map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 shadow-[var(--shadow-card)]"
            >
              <span className="text-sm text-text-primary">{s}</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                No known issues
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">Uptime history</p>
          <p className="mt-2 flex items-start gap-2 text-sm text-text-secondary">
            <Clock size={15} className="mt-0.5 shrink-0 text-text-muted" aria-hidden="true" />
            Live uptime history coming soon — incidents are posted here manually by the team until
            a real monitor feed is wired up.
          </p>
        </div>

        <div className="mt-6 flex items-start gap-2 rounded-xl border border-dashed border-border-strong p-4 text-sm text-text-muted">
          <Megaphone size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            Current notices: none. If something is wrong with your account right now, open a ticket
            or message us on WhatsApp — this board is updated by hand and may lag.
          </span>
        </div>
      </div>
    </div>
  );
}
