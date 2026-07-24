"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Globe, LifeBuoy, MessageCircle, Truck, User, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { faqs } from "@/components/home/faq";

const categories = [
  {
    id: "billing",
    icon: CreditCard,
    label: "Billing",
    tip: faqs.find((f) => f.question.includes("renews"))?.answer,
  },
  {
    id: "technical",
    icon: Wrench,
    label: "Technical",
    tip: faqs.find((f) => f.question.includes("WordPress"))?.answer,
  },
  {
    id: "migration",
    icon: Truck,
    label: "Migration",
    tip: faqs.find((f) => f.question.includes("migration"))?.answer,
  },
  {
    id: "domains",
    icon: Globe,
    label: "Domains",
    tip: "Manage domains, DNS, and transfers from the Domains section of your client portal, or search and register a new one anytime.",
  },
  {
    id: "account",
    icon: User,
    label: "Account",
    tip: faqs.find((f) => f.question.includes("upgrade"))?.answer,
  },
];

function openChat() {
  const trigger = document.querySelector<HTMLElement>('[aria-label="Open chat"]');
  trigger?.click();
}

export function IssuePicker() {
  const [selected, setSelected] = useState<string | null>(null);
  const category = categories.find((c) => c.id === selected);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelected(c.id)}
            aria-pressed={selected === c.id}
            className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all duration-200 ${
              selected === c.id
                ? "border-brand-purple bg-brand-purple/10 text-brand-purple"
                : "border-border text-text-secondary hover:border-border-strong hover:text-text-primary"
            }`}
          >
            <c.icon size={20} aria-hidden="true" />
            <span className="text-xs font-medium sm:text-sm">{c.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {category && (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-6 rounded-2xl border border-border-strong bg-card p-6"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-brand-purple">
              Quick answer
            </p>
            <p className="mt-2 text-sm text-text-secondary">{category.tip}</p>
            <div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-5">
              <Button href="https://portal.shrotihost.in/submitticket.php" size="md">
                <LifeBuoy size={15} aria-hidden="true" />
                Open a ticket
              </Button>
              <Button variant="secondary" size="md" onClick={openChat}>
                <MessageCircle size={15} aria-hidden="true" />
                Start live chat
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
