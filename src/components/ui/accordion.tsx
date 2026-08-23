"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

export type AccordionItem = { q: string; a: string };

/**
 * The sitewide disclosure pattern (extracted from the homepage FAQ so every
 * FAQ block shares one interaction): 1px card on shadow-card, chevron
 * affordance, active-item brand edge, height-animated reveal.
 *
 * Every answer stays MOUNTED — collapsed to height 0, `aria-hidden` and
 * `inert` — so the FAQPage schema on these pages describes text that is
 * really in the HTML, and crawlers/find-in-page see the full Q&A.
 */
export function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: AccordionItem[];
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        const triggerId = `${baseId}-trigger-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <Reveal key={item.q} delay={i * 0.03}>
            <div
              className={`rounded-2xl border bg-card shadow-[var(--shadow-card)] transition-colors duration-200 ${
                isOpen ? "border-brand-purple/50" : "border-border"
              }`}
            >
              <button
                type="button"
                id={triggerId}
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="text-sm font-medium text-text-primary sm:text-base">{item.q}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              <motion.div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                aria-hidden={!isOpen}
                inert={!isOpen}
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.25, ease: [0.33, 1, 0.68, 1] }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5 text-sm text-text-secondary">{item.a}</div>
              </motion.div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
