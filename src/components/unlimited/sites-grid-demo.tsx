"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const seedSites = ["agency.dev", "clientone.com", "clienttwo.in", "portfolio.io", "sidehustle.shop"];

export function SitesGridDemo() {
  const [sites, setSites] = useState(seedSites);

  function addSite() {
    const n = sites.length + 1;
    setSites((s) => [...s, `project${n}.com`]);
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-border-strong bg-card p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-text-primary">Your sites</p>
        <button
          type="button"
          onClick={addSite}
          className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-brand-purple hover:text-brand-purple"
        >
          <Plus size={13} aria-hidden="true" />
          Add another site
        </button>
      </div>

      <motion.div layout className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <AnimatePresence initial={false}>
          {sites.map((site) => (
            <motion.div
              key={site}
              layout
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
              className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-3"
            >
              <div className="flex items-center justify-between">
                <Globe size={14} className="text-brand-purple" aria-hidden="true" />
                <Badge tone="success" className="text-xs">
                  Live
                </Badge>
              </div>
              <p className="truncate font-mono text-xs text-text-primary">{site}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <p className="mt-5 text-center text-xs text-text-muted">
        {sites.length} sites hosted — same plan, same price. No per-site add-ons.
      </p>
    </div>
  );
}
