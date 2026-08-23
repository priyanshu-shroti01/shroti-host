"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CreditCard,
  Handshake,
  LifeBuoy,
  MessageCircle,
  ShoppingCart,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ContactPath = {
  id: string;
  icon: LucideIcon;
  label: string;
  body: string;
  cta: string;
  href: string;
  /** Off-site destination (WhatsApp) — opens in a new tab. */
  external?: boolean;
};

const paths: ContactPath[] = [
  {
    id: "whatsapp",
    icon: MessageCircle,
    label: "WhatsApp",
    body: "The fastest way to reach a human — chat with us directly on WhatsApp.",
    cta: "Chat on WhatsApp",
    href: "https://wa.me/919582129099",
    external: true,
  },
  {
    id: "sales",
    icon: ShoppingCart,
    label: "Sales",
    body: "Questions before you buy — plan sizing, custom needs, anything pre-sales.",
    // Pre-sales goes straight to a human on WhatsApp — a ticket queue is the
    // wrong first impression for someone who hasn't bought yet.
    cta: "Chat with sales on WhatsApp",
    href: "https://wa.me/919582129099?text=Hi%20ShrotiHost%2C%20I%27d%20like%20to%20talk%20about%20hosting",
    external: true,
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
    href: "https://portal.shrotihost.in/submitticket.php",
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
              p.id === "whatsapp" ? "col-span-2 flex-row justify-center sm:col-span-3" : ""
            } ${
              selected === p.id
                ? "border-brand-purple bg-brand-purple/10 text-brand-purple-text"
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
            <Button
              href={path.href}
              size="lg"
              {...(path.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {path.cta}
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
