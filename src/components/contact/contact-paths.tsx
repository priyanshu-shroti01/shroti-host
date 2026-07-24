"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CreditCard, Handshake, LifeBuoy, ShoppingCart, Truck, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const paths = [
  {
    id: "sales",
    icon: ShoppingCart,
    label: "Sales",
    body: "Questions before you buy — plan sizing, custom needs, anything pre-sales.",
    cta: "Ask a pre-sales question",
    href: "https://portal.shrotihost.in/submitticket.php",
  },
  {
    id: "support",
    icon: LifeBuoy,
    label: "Support",
    body: "Something's broken or not working as expected on an active account.",
    cta: "Open a support ticket",
    href: "https://portal.shrotihost.in/submitticket.php",
  },
  {
    id: "migration",
    icon: Truck,
    label: "Migration",
    body: "Moving from another host — free on every plan.",
    cta: "Request free migration",
    href: "/migration",
  },
  {
    id: "technical",
    icon: Wrench,
    label: "Technical",
    body: "Server config, PHP versions, SSH, or anything developer-facing.",
    cta: "Open a technical ticket",
    href: "https://portal.shrotihost.in/submitticket.php",
  },
  {
    id: "partnership",
    icon: Handshake,
    label: "Partnership",
    body: "Reseller, affiliate, or collaboration inquiries.",
    cta: "Get in touch",
    href: "https://portal.shrotihost.in/submitticket.php",
  },
  {
    id: "billing",
    icon: CreditCard,
    label: "Billing",
    body: "Invoices, payment methods, or renewal questions on your account.",
    cta: "Go to billing",
    href: "https://portal.shrotihost.in/clientarea.php?action=invoices",
  },
];

export function ContactPaths() {
  const [selected, setSelected] = useState<string | null>(null);
  const path = paths.find((p) => p.id === selected);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {paths.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelected(p.id)}
            aria-pressed={selected === p.id}
            className={`flex flex-col items-center gap-2 rounded-2xl border p-5 text-center transition-all duration-200 ${
              selected === p.id
                ? "border-brand-purple bg-brand-purple/10 text-brand-purple"
                : "border-border text-text-secondary hover:border-border-strong hover:text-text-primary"
            }`}
          >
            <p.icon size={22} aria-hidden="true" />
            <span className="text-sm font-medium">{p.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {path && (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-border-strong bg-card p-8 text-center"
          >
            <p className="max-w-sm text-text-secondary">{path.body}</p>
            <Button href={path.href} size="lg">
              {path.cta}
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
