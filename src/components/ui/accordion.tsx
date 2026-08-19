"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export type AccordionItem = { q: string; a: string };

/**
 * The sitewide disclosure pattern (extracted from the homepage FAQ so every
 * FAQ block shares one interaction): border-2 card on shadow-card, chevron
 * affordance, active-item brand edge, height-animated reveal.
 */
export function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: AccordionItem[];
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <Reveal key={item.q} delay={i * 0.03}>
            <div
              className={`rounded-2xl border-2 bg-card shadow-[var(--shadow-card)] transition-colors duration-200 ${
                isOpen ? "border-brand-purple/50" : "border-border"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="text-sm font-medium text-text-primary sm:text-base">{item.q}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-sm text-text-secondary">{item.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
