import {
  ArrowRightLeft,
  BookOpen,
  CreditCard,
  FileText,
  Globe,
  GraduationCap,
  HelpCircle,
  LayoutGrid,
  LifeBuoy,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Newspaper,
  Search,
  Server,
  Tag,
  Truck,
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
      { label: "Shared Hosting", href: "/hosting", description: "Launch, Grow, and Scale plans", icon: Server },
      { label: "WordPress Hosting", href: "/wordpress-hosting", description: "Optimized for WordPress & WooCommerce", icon: Globe },
      { label: "Unlimited Hosting", href: "/unlimited-hosting", description: "For agencies and multi-site owners", icon: Users },
      { label: "Email Hosting", href: "/hosting#developer", description: "Business mailboxes on your domain", icon: Mail },
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
  {
    label: "Resources",
    icon: BookOpen,
    items: [
      { label: "Documentation", href: "/docs", description: "Guides for setup and migration", icon: FileText },
      { label: "Status", href: "/status", description: "Live infrastructure status", icon: Server },
      { label: "Migration", href: "/migration", description: "Move your site to ShrotiHost, free", icon: Truck },
      { label: "FAQs", href: "/#faq", description: "Answers to common questions", icon: HelpCircle },
    ],
  },
  {
    label: "Modules",
    icon: LayoutGrid,
    href: "/modules",
    items: [
      { label: "All Modules", href: "/modules", description: "Browse every WHMCS module we build", icon: LayoutGrid },
      { label: "Gateway Fees & Allocator", href: "/modules/gateway-fees-allocator", description: "Recover payment processing costs", icon: CreditCard },
      { label: "WhatsApp Notification Module", href: "/modules/whatsapp-notification", description: "Billing & support alerts over WhatsApp", icon: MessageCircle },
    ],
  },
  {
    label: "More",
    icon: MoreHorizontal,
    items: [
      { label: "WordPress Hosting", href: "/wordpress-hosting", description: "Tuned for WordPress & WooCommerce", icon: Globe },
      { label: "Student Program", href: "/student", description: "Discounted plans, free launch subdomain", icon: GraduationCap },
      { label: "Blog", href: "/blog", description: "Guides, tips, and product updates", icon: Newspaper },
      { label: "Support", href: "/support", description: "Get help from our team", icon: LifeBuoy },
    ],
  },
];

export const footerNav = {
  Hosting: [
    { label: "Shared Hosting", href: "/hosting" },
    { label: "WordPress Hosting", href: "/wordpress-hosting" },
    { label: "Unlimited Hosting", href: "/unlimited-hosting" },
    { label: "Domains", href: "/domains" },
    { label: "Email Hosting", href: "/hosting#developer" },
    { label: "VPS (coming soon)", href: "/hosting#roadmap" },
    { label: "Cloud Hosting (coming soon)", href: "/hosting#roadmap" },
    { label: "Reseller Hosting (coming soon)", href: "/hosting#roadmap" },
  ],
  Modules: [
    { label: "All Modules", href: "/modules" },
    { label: "Gateway Fees & Allocator", href: "/modules/gateway-fees-allocator" },
    { label: "WhatsApp Notification Module", href: "/modules/whatsapp-notification" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Student Program", href: "/student" },
    { label: "Startup Program", href: "/startup" },
    { label: "Contact", href: "/contact" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Blog", href: "/blog" },
    { label: "Status", href: "/status" },
    { label: "Migration", href: "/migration" },
    { label: "API (coming soon)", href: "/hosting#roadmap" },
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
