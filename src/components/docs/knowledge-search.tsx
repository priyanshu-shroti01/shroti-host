"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LifeBuoy, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { faqs } from "@/components/home/faq";

const topics = ["Migration", "Billing", "WordPress", "Students", "Domains"];

export function KnowledgeSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<number | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="relative">
        <Search size={20} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles… try 'migration' or 'renew'"
          aria-label="Search knowledge base"
          style={{ caretColor: "var(--color-brand-purple)" }}
          className="h-16 w-full rounded-full border border-border-strong bg-card pl-14 pr-4 text-base text-text-primary placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-brand-purple"
        />
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {topics.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setQuery(t)}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-brand-purple hover:text-brand-purple"
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-10">
        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-strong p-8 text-center">
            <p className="text-sm text-text-secondary">
              No articles match &ldquo;{query}&rdquo; yet — the knowledge base is growing.
            </p>
            <Button href="https://portal.shrotihost.in/submitticket.php" size="md" className="mt-4">
              <LifeBuoy size={15} aria-hidden="true" />
              Ask support instead
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border rounded-2xl border border-border">
            {results.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div key={faq.question}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-sm font-medium text-text-primary sm:text-base">{faq.question}</span>
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
                        <div className="px-6 pb-5 text-sm text-text-secondary">{faq.answer}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
