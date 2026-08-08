import {
  ArrowRightLeft,
  Building2,
  Globe,
  Layers,
  Mail,
  Search,
  Server,
  Share2,
  Tag,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavLink = { label: string; href: string; description?: string; icon?: LucideIcon };

export type NavItem = {
  label: string;
  href?: string;
  icon: LucideIcon;
  items?: NavLink[];
};

export const primaryNav: NavItem[] = [
  {
    label: "Hosting",
    icon: Server,
    items: [
      { label: "Shared Hosting", href: "/hosting", description: "Bronze, Gold, Platinum, and Diamond plans", icon: Server },
      { label: "WordPress Hosting", href: "/wordpress-hosting", description: "Optimized for WordPress & WooCommerce", icon: Globe },
      { label: "Unlimited Hosting", href: "/unlimited-hosting", description: "For agencies and multi-site owners", icon: Users },
      { label: "Email Hosting", href: "/hosting#compare", description: "Business mailboxes on your domain", icon: Mail },
      { label: "Reseller Hosting", href: "/reseller-hosting", description: "Start your own hosting business", icon: Share2 },
      { label: "Master Reseller Hosting", href: "/master-reseller-hosting", description: "Create resellers of your own", icon: Building2 },
      { label: "Alpha Reseller Hosting", href: "/alpha-reseller-hosting", description: "The elite, maximum-resource tier", icon: Layers },
      { label: "VPS Hosting", href: "/vps", description: "Plans coming soon", icon: Server },
    ],
  },
  {
    label: "Domains",
    icon: Globe,
    href: "/domains",
    items: [
      { label: "Search Domains", href: "/domains", description: "Find and register a new domain", icon: Search },
      { label: "Transfer a Domain", href: "https://portal.shrotihost.in/cart.php?a=add&domain=transfer", description: "Move an existing domain to us", icon: ArrowRightLeft },
      { label: "Domain Pricing", href: "https://portal.shrotihost.in/index.php/domain/pricing", description: "Full TLD pricing list", icon: Tag },
    ],
  },
  { label: "About", icon: Building2, href: "/about" },
  { label: "Contact", icon: Mail, href: "/contact" },
];

export const footerNav = {
  Hosting: [
    { label: "Shared Hosting", href: "/hosting" },
    { label: "WordPress Hosting", href: "/wordpress-hosting" },
    { label: "Unlimited Hosting", href: "/unlimited-hosting" },
    { label: "Domains", href: "/domains" },
    { label: "Email Hosting", href: "/hosting#compare" },
    { label: "Reseller Hosting", href: "/reseller-hosting" },
    { label: "Master Reseller Hosting", href: "/master-reseller-hosting" },
    { label: "Alpha Reseller Hosting", href: "/alpha-reseller-hosting" },
    { label: "VPS (coming soon)", href: "/vps" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Status", href: "/status" },
  ],
  Legal: [
    { label: "Terms", href: "/legal/terms" },
    { label: "Privacy", href: "/legal/privacy" },
    { label: "Refund Policy", href: "/legal/refund-policy" },
    { label: "Acceptable Use Policy", href: "/legal/aup" },
  ],
  Support: [
    { label: "Dashboard / Client Portal", href: "https://portal.shrotihost.in/clientarea.php" },
    { label: "Submit a Ticket", href: "https://portal.shrotihost.in/submitticket.php" },
    { label: "Domain Pricing", href: "https://portal.shrotihost.in/index.php/domain/pricing" },
    { label: "Contact", href: "/contact" },
  ],
};

export const socialLinks: { label: string; href: string }[] = [];
