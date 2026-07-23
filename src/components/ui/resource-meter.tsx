"use client";

import { motion } from "framer-motion";

export function ResourceMeter({
  label,
  valueLabel,
  value,
  max,
  delay = 0,
  emphasis = false,
}: {
  label: string;
  valueLabel: string;
  value: number;
  max: number;
  delay?: number;
  emphasis?: boolean;
}) {
  const unlimited = !Number.isFinite(value);
  const percent = unlimited ? 100 : Math.max(6, Math.round((value / max) * 100));

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="text-text-muted">{label}</span>
        <span className={`font-medium tabular-nums ${emphasis ? "text-brand-purple" : "text-text-secondary"}`}>
          {valueLabel}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border">
        {unlimited ? (
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-blue"
          />
        ) : (
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${percent}%` }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={`h-full rounded-full ${emphasis ? "bg-brand-purple" : "bg-text-muted/50"}`}
          />
        )}
      </div>
    </div>
  );
}
