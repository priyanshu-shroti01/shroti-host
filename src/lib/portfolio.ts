import type { LucideIcon } from "lucide-react";
import { Blocks, Globe, MessageCircle } from "lucide-react";

/**
 * Portfolio entries. HARD RULE: only work that verifiably exists may appear
 * here — our own products and this website. No invented client projects, no
 * placeholder logos, no "confidential enterprise client" filler. When real
 * client case studies are approved for publication, they join this list.
 */

export type PortfolioItem = {
  slug: string;
  name: string;
  kind: "Website" | "Product";
  icon: LucideIcon;
  summary: string;
  /** Concrete, verifiable capabilities — each one is live and inspectable. */
  highlights: string[];
  href: string;
  linkLabel: string;
};

export const portfolioItems: PortfolioItem[] = [
  {
    slug: "shrotihost-website",
    name: "shrotihost.in",
    kind: "Website",
    icon: Globe,
    summary:
      "The site you're on — our own platform, designed and engineered in-house. It's the standing work sample for every web project we take.",
    highlights: [
      "Custom design system with scroll-driven exploded infrastructure views",
      "Live domain search with real-time availability checks and TLD pricing synced from our billing system",
      "Multi-currency pricing (INR / USD / EUR) with honest, same-on-renewal rates",
      "Statically prerendered Next.js — every marketing page ships as fast HTML",
    ],
    href: "/",
    linkLabel: "You're browsing it",
  },
  {
    slug: "whmcs-gateway-fees-allocator",
    name: "Gateway Fees & Allocator",
    kind: "Product",
    icon: Blocks,
    summary:
      "A WHMCS module we build, sell, and support — it recovers payment-gateway costs and controls which payment methods appear at checkout.",
    highlights: [
      "Per-gateway charges and discounts, with tier steps and caps",
      "Gateway allocation by country, currency, client group, order value and product",
      "Client and line-item exceptions, so the fee base is never the whole invoice",
      "Configured entirely from the WHMCS admin area",
    ],
    href: "/whmcs-gateway-fees-allocator",
    linkLabel: "See the product",
  },
  {
    slug: "whmcs-whatsapp-notification-module",
    name: "WhatsApp Notification Module",
    kind: "Product",
    icon: MessageCircle,
    summary:
      "Our WHMCS module that moves client notifications — invoices, OTPs, order updates — onto WhatsApp, where customers actually read them.",
    highlights: [
      "Works with flexible WhatsApp API providers",
      "OTP delivery, PDF invoice attachments, and full message logging",
      "100+ ready notification templates plus bulk messaging",
      "Licensed monthly, quarterly, or yearly — with a free trial",
    ],
    href: "/whmcs-whatsapp-notification-module",
    linkLabel: "See the product",
  },
];
