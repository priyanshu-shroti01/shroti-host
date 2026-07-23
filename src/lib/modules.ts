import {
  BarChart3,
  Bell,
  CreditCard,
  FileText,
  Globe2,
  MessageCircle,
  Send,
  ShieldCheck,
  Sliders,
  Users,
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
  /** Purchase happens on the existing live product page until direct cart links are wired up. */
  purchaseUrl: string;
};

export const modules: WhmcsModule[] = [
  {
    slug: "gateway-fees-allocator",
    name: "Gateway Fees & Allocator",
    tagline: "Recover payment processing costs and control gateway visibility.",
    icon: CreditCard,
    description:
      "Set fees or discounts per payment gateway and control which methods appear based on buyer context — all from the WHMCS admin panel, no custom checkout code required.",
    features: [
      {
        icon: Sliders,
        title: "Fee & discount management",
        description: "Apply gateway charges for cost recovery, or discounts to nudge preferred payment methods.",
      },
      {
        icon: Globe2,
        title: "Contextual gateway routing",
        description: "Show payment options based on country, currency, client type, order value, and products.",
      },
      {
        icon: Users,
        title: "Client exceptions",
        description: "Override rules for specific accounts without touching your baseline logic.",
      },
      {
        icon: FileText,
        title: "Checkout transparency",
        description: "Show the fee impact before payment confirmation, and keep it consistent on invoices.",
      },
    ],
    audience: [
      "Hosting providers managing multiple gateways",
      "Resellers operating across mixed currencies",
      "WHMCS operators protecting margins",
      "Billing teams handling repeated checkout exceptions",
    ],
    trial: "7-day free trial",
    setup: "Configured in minutes from the WHMCS admin panel",
    purchaseUrl: "https://shrotihost.in/whmcs-gateway-fees-allocator/",
  },
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
    purchaseUrl: "https://shrotihost.in/whmcs-whatsapp-notification-module/",
  },
];

export function getModule(slug: string) {
  return modules.find((m) => m.slug === slug);
}
