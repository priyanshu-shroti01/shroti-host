import {
  BarChart3,
  Bell,
  FileText,
  MessageCircle,
  Send,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type ModulePricing = {
  label: string;
  priceInr: number;
  period: string;
  note?: string;
};

export type WhmcsModule = {
  slug: string;
  name: string;
  tagline: string;
  icon: LucideIcon;
  description: string;
  features: { icon: LucideIcon; title: string; description: string }[];
  audience: string[];
  /** Omitted when the vendor page doesn't disclose exact pricing — never invent a number. */
  pricing?: ModulePricing[];
  trial?: string;
  setup: string;
  /** Purchase routes through the support desk until direct cart links exist. */
  purchaseUrl: string;
};

export const modules: WhmcsModule[] = [
  // Gateway Fees & Allocator is no longer described here: its page at
  // /whmcs-gateway-fees-allocator is bespoke and reads from
  // lib/gateway-fees-module.ts, where every capability carries the module
  // file:line it was verified against. Keeping a second, drifting copy of the
  // same claims here is how a page ends up advertising a trial nobody offers.
  {
    slug: "whatsapp-notification",
    name: "WhatsApp Notification Module",
    tagline: "WhatsApp messaging built into WHMCS — billing, support, and verification, automated.",
    icon: MessageCircle,
    description:
      "Automate invoice reminders, payment confirmations, support ticket alerts, service lifecycle notifications, OTP verification, and bulk campaigns — all triggered directly from WHMCS.",
    features: [
      {
        icon: Send,
        title: "Flexible API support",
        description: "Works with WhatsApp Cloud API or WhatsApp Web.",
      },
      {
        icon: ShieldCheck,
        title: "OTP verification",
        description: "Reduce fraudulent signups with phone number validation.",
      },
      {
        icon: FileText,
        title: "PDF invoice delivery",
        description: "Send WHMCS invoices directly over WhatsApp.",
      },
      {
        icon: Zap,
        title: "100+ ready templates",
        description: "Pre-built automation flows so you deploy faster.",
      },
      {
        icon: BarChart3,
        title: "Comprehensive logging",
        description: "Track delivery status and queue analytics.",
      },
      {
        icon: Bell,
        title: "Bulk messaging",
        description: "Launch renewal pushes and campaigns straight from customer data.",
      },
    ],
    audience: [
      "Hosting providers improving payment recovery",
      "WHMCS admins reducing support overhead",
      "Teams automating customer engagement across billing and service cycles",
    ],
    pricing: [
      { label: "Monthly", priceInr: 349, period: "/mo" },
      { label: "Quarterly", priceInr: 999, period: "/quarter" },
      { label: "Annual", priceInr: 2999, period: "/year", note: "Includes complimentary WhatsApp API" },
    ],
    trial: "Free trial available",
    setup: "5-minute installation with included support",
    purchaseUrl: "https://portal.shrotihost.in/submitticket.php",
  },
];

export function getModule(slug: string) {
  return modules.find((m) => m.slug === slug);
}
