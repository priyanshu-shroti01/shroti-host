"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export const faqs = [
  {
    question: "Is migration really free?",
    answer:
      "Yes. Our team migrates your website, files, and databases from your current host at no extra cost, on every hosting plan.",
  },
  {
    question: "Can I upgrade my plan later?",
    answer:
      "Yes. You can move from Bronze to Diamond at any time without migrating your website to a new server.",
  },
  {
    question: "What billing cycles do you offer?",
    answer:
      "Monthly, 3 months, 6 months, or annual — pick whichever fits, with the same renewal price shown upfront on every cycle.",
  },
  {
    question: "What happens after my plan renews?",
    answer:
      "Renewal pricing is always shown clearly before you purchase, so there are no surprises at renewal time.",
  },
  {
    question: "Do you support WordPress?",
    answer:
      "Yes. Every plan includes LiteSpeed Cache and one-click WordPress installation via Softaculous. Our dedicated WordPress Hosting plan adds further performance optimizations.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="mx-auto mt-12 max-w-2xl divide-y divide-border rounded-2xl border border-border">
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={faq.question} delay={i * 0.03}>
              <div>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-sm font-medium text-text-primary sm:text-base">
                    {faq.question}
                  </span>
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
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
