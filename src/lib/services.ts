import type { LucideIcon } from "lucide-react";
import {
  AppWindow,
  Blocks,
  Boxes,
  CircuitBoard,
  Cloud,
  Code2,
  CreditCard,
  Database,
  Fingerprint,
  Gauge,
  Globe,
  LayoutDashboard,
  LayoutTemplate,
  LifeBuoy,
  Link2,
  Palette,
  PenTool,
  Rocket,
  Server,
  Smartphone,
  ShoppingCart,
  Store,
  TabletSmartphone,
  Workflow,
  Wrench,
} from "lucide-react";

/**
 * Development ("BUILD") services. Copy rules, non-negotiable:
 * no invented clients, statistics, awards, or price claims. Proof points
 * reference only things that verifiably exist — the two WHMCS modules we
 * sell, this website itself, and the hosting platform every build ships to.
 * Pricing is deliberately absent: the enquiry flow replaces "starting at ₹X"
 * until real rate cards exist (same rule as lib/modules.ts).
 */

export type ProcessStage = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type ServiceOffering = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type Service = {
  slug: string;
  /** Short name used in nav, cards, and selectors. */
  name: string;
  eyebrow: string;
  /** Hero H1 — first part plain, last word(s) gradient-clipped. */
  headline: [string, string];
  subhead: string;
  metaTitle: string;
  metaDescription: string;
  /** The dominant visual: the real path a project takes, in order. */
  process: ProcessStage[];
  processIntro: string;
  offerings: ServiceOffering[];
  /** Why build this with a hosting company — the HOST × BUILD synergy. */
  synergy: { title: string; description: string }[];
  faqs: { q: string; a: string }[];
  ctaLabel: string;
  related: { label: string; href: string }[];
};

export const PROJECT_TYPES = [
  "Website",
  "Web App",
  "Mobile App",
  "E-commerce",
  "SaaS",
  "Custom Software",
  "Not sure yet",
] as const;

export const BUDGET_RANGES = [
  "Under ₹25,000",
  "₹25,000 – ₹75,000",
  "₹75,000 – ₹2,00,000",
  "Above ₹2,00,000",
  "Not sure yet",
] as const;

export const TIMELINES = ["As soon as possible", "Within a month", "1–3 months", "Flexible"] as const;

export const services: Service[] = [
  {
    slug: "web-development",
    name: "Web Development",
    eyebrow: "Web Development",
    headline: ["We don't just host websites.", "We build them."],
    subhead:
      "Business websites, web applications, and everything between — designed, built, and deployed on the same infrastructure that serves them. One partner from first mockup to production.",
    metaTitle: "Web Development Services",
    metaDescription:
      "Business websites, landing pages, web apps, and custom systems — designed, built, and hosted by one team. From first mockup to production on ShrotiHost infrastructure.",
    processIntro:
      "Every project moves through the same pipeline this website did. No hand-offs between vendors — the team that designs it builds it, and the platform that builds it hosts it.",
    process: [
      { title: "Design", description: "Structure, copy, and visual direction agreed before a line of code.", icon: PenTool },
      { title: "Frontend", description: "Fast, responsive, accessible interfaces.", icon: LayoutTemplate },
      { title: "API", description: "The endpoints your product logic lives behind.", icon: Code2 },
      { title: "Database", description: "Your data modeled properly from day one.", icon: Database },
      { title: "Infrastructure", description: "Hosting, SSL, DNS, and backups configured for you.", icon: Server },
      { title: "Production", description: "Live on your domain, monitored, and maintained.", icon: Rocket },
    ],
    offerings: [
      { title: "Business websites", description: "A fast, credible home for your company that you can update yourself.", icon: Globe },
      { title: "Landing pages", description: "Single-purpose pages built to convert one audience on one offer.", icon: LayoutTemplate },
      { title: "Web applications", description: "Products with accounts, dashboards, and real business logic.", icon: AppWindow },
      { title: "Dashboards & admin panels", description: "Internal views of the numbers you check every day.", icon: LayoutDashboard },
      { title: "APIs & integrations", description: "Connect the tools you already use — billing, CRM, WhatsApp, and more.", icon: Link2 },
      { title: "Custom systems", description: "The workflow no off-the-shelf tool fits — built to fit.", icon: Blocks },
    ],
    synergy: [
      {
        title: "Built here, hosted here",
        description:
          "The site ships straight onto ShrotiHost infrastructure — LiteSpeed, NVMe, free SSL, daily backups — with no deployment hand-off to a third party.",
      },
      {
        title: "This website is the portfolio",
        description:
          "shrotihost.in — the design system, the animations, the domain search, the pricing engine — was designed and built in-house. What you're browsing is the work sample.",
      },
      {
        title: "One bill, one support channel",
        description:
          "Hosting, domain, and development under one roof. When something needs fixing, there's no vendor triangle — you message the team that built it.",
      },
    ],
    faqs: [
      {
        q: "What do you build with?",
        a: "Modern web stacks — the same family of tools this site is built with (React/Next.js), plus WordPress and PHP where a content-managed site fits better. We pick the stack that fits the project, not the other way around.",
      },
      {
        q: "How much does a website cost?",
        a: "It depends on scope — a landing page and a web application are different projects. Tell us what you're building through the enquiry form and we'll reply with a concrete quote. No invented 'starting at' numbers.",
      },
      {
        q: "Do I have to host with ShrotiHost?",
        a: "No — but it's better when you do. Builds ship to our infrastructure by default, which is how we keep deployment, SSL, DNS, and maintenance seamless. If you need to deploy elsewhere, we'll hand over clean, documented code.",
      },
      {
        q: "Can you work with my existing website?",
        a: "Yes. Redesigns, rebuilds, performance rescues, and migrations onto our hosting are all normal projects — migration help is free with hosting.",
      },
    ],
    ctaLabel: "Start a Web Project",
    related: [
      { label: "E-commerce Development", href: "/ecommerce-development" },
      { label: "SaaS Development", href: "/saas-development" },
      { label: "Shared Hosting", href: "/hosting" },
    ],
  },
  {
    slug: "app-development",
    name: "App Development",
    eyebrow: "App Development",
    headline: ["Your app, from idea", "to installed."],
    subhead:
      "Android, iOS, and cross-platform applications with the backend, APIs, and cloud infrastructure they run on — planned, built, and shipped by one team.",
    metaTitle: "Mobile App Development Services",
    metaDescription:
      "Android, iOS, and cross-platform app development with backend, APIs, authentication, and deployment — one team from idea to installed, backed by ShrotiHost infrastructure.",
    processIntro:
      "An app is more than the screens — it's the backend, the accounts, the payments, and the infrastructure underneath. We build the whole path.",
    process: [
      { title: "Idea", description: "What it does, who it's for, and what version one must prove.", icon: Rocket },
      { title: "UX", description: "Flows and wireframes before pixels — so screens earn their place.", icon: Workflow },
      { title: "UI", description: "Interface design your users won't need a manual for.", icon: Palette },
      { title: "Application", description: "The app itself — Android, iOS, or cross-platform.", icon: Smartphone },
      { title: "API", description: "The backend your app talks to, built alongside it.", icon: Code2 },
      { title: "Cloud", description: "Servers, storage, and scaling on real infrastructure.", icon: Cloud },
      { title: "Production", description: "Store submission, monitoring, and updates.", icon: TabletSmartphone },
    ],
    offerings: [
      { title: "Android apps", description: "Native-quality apps for the platform most of India uses.", icon: Smartphone },
      { title: "iOS apps", description: "Polished apps for the App Store.", icon: TabletSmartphone },
      { title: "Cross-platform apps", description: "One codebase, both stores — when speed to market matters.", icon: AppWindow },
      { title: "Backend & APIs", description: "The server side every serious app needs, hosted on our own infrastructure.", icon: Server },
      { title: "Authentication & payments", description: "Sign-in, OTP, and payment gateway integration done properly.", icon: Fingerprint },
      { title: "Maintenance & updates", description: "OS updates, bug fixes, and new features after launch.", icon: Wrench },
    ],
    synergy: [
      {
        title: "The backend lives here",
        description:
          "Your app's API and database run on ShrotiHost infrastructure — the same platform we run our own systems on — with one team responsible for both sides.",
      },
      {
        title: "Payments and messaging are home turf",
        description:
          "We build and sell WHMCS modules for payment-gateway fees and WhatsApp notifications. OTPs, invoices, and gateway flows are problems we've already shipped solutions for.",
      },
      {
        title: "Grows into VPS when you do",
        description:
          "Start on shared infrastructure, move to VPS as usage grows — without changing vendors or re-architecting.",
      },
    ],
    faqs: [
      {
        q: "How much does an app cost?",
        a: "Scope decides it: number of screens, backend complexity, integrations, and platforms. Describe the app in the enquiry form and we'll come back with a real estimate for your project — not a generic range.",
      },
      {
        q: "Do you build both Android and iOS?",
        a: "Yes — natively per platform or cross-platform from one codebase. We'll recommend which fits your budget and audience after understanding the project.",
      },
      {
        q: "Can you build just the backend for my existing app?",
        a: "Yes. APIs, databases, authentication, and admin panels for apps built elsewhere are well-scoped projects — and they deploy straight onto our hosting.",
      },
      {
        q: "What happens after launch?",
        a: "Apps need updates — OS releases, security patches, new features. We offer ongoing maintenance so version 1.0 isn't the last version.",
      },
    ],
    ctaLabel: "Build My App",
    related: [
      { label: "SaaS Development", href: "/saas-development" },
      { label: "Custom Software", href: "/custom-software" },
      { label: "VPS Hosting", href: "/vps" },
    ],
  },
  {
    slug: "ecommerce-development",
    name: "E-commerce Development",
    eyebrow: "E-commerce",
    headline: ["A store that sells while", "you sleep."],
    subhead:
      "WooCommerce stores and custom storefronts with payments, shipping, and catalog management — built on hosting tuned for exactly this workload.",
    metaTitle: "E-commerce Website Development",
    metaDescription:
      "WooCommerce and custom online-store development with payments, shipping, and catalog setup — built and hosted on infrastructure tuned for WordPress and WooCommerce.",
    processIntro:
      "An online store is a product catalog, a payment flow, and trust — assembled in the right order and hosted where it stays fast on sale day.",
    process: [
      { title: "Catalog", description: "Products, variants, categories, and pricing structured cleanly.", icon: Boxes },
      { title: "Storefront", description: "A fast, mobile-first shop your customers can actually browse.", icon: Store },
      { title: "Payments", description: "UPI, cards, net banking — the methods Indian customers expect.", icon: CreditCard },
      { title: "Shipping & tax", description: "Zones, rates, invoices, and GST fields configured correctly.", icon: Workflow },
      { title: "Hosting", description: "WooCommerce-tuned LiteSpeed hosting with caching that survives traffic.", icon: Server },
      { title: "Launch", description: "Live on your domain with SSL, backups, and monitoring.", icon: Rocket },
    ],
    offerings: [
      { title: "WooCommerce stores", description: "The world's most-used store platform, on hosting tuned for it.", icon: ShoppingCart },
      { title: "Custom storefronts", description: "When your catalog or checkout doesn't fit a template.", icon: Store },
      { title: "Payment integration", description: "Gateway setup, fee handling, and checkout flows done right.", icon: CreditCard },
      { title: "Store migrations", description: "Move an existing store here without losing orders or SEO.", icon: Workflow },
      { title: "Performance rescues", description: "Slow store? We find why and fix it at the stack level.", icon: Gauge },
      { title: "Ongoing store care", description: "Updates, plugins, and catalog help after launch.", icon: LifeBuoy },
    ],
    synergy: [
      {
        title: "Hosting tuned for WooCommerce",
        description:
          "Our WordPress hosting runs LiteSpeed with server-level caching built for WooCommerce — the store and the server are configured together, by the same team.",
      },
      {
        title: "Payment plumbing is our product",
        description:
          "We literally sell a payment-gateway fees module for WHMCS. Checkout economics — gateway fees, method routing, transparency — are a domain we build software in.",
      },
      {
        title: "Sale-day traffic has somewhere to go",
        description: "When the store outgrows shared hosting, VPS is one conversation away — not a re-platform.",
      },
    ],
    faqs: [
      {
        q: "WooCommerce or custom — which should I pick?",
        a: "WooCommerce fits most catalogs and budgets and keeps you in control of content. Custom makes sense when your checkout, catalog, or integrations outgrow what plugins do cleanly. We'll recommend honestly — WooCommerce is the right answer more often than agencies admit.",
      },
      {
        q: "Which payment methods can my store accept?",
        a: "The methods Indian gateways support — UPI, cards, net banking, and wallets — through providers like the ones our own portal uses. We configure the gateway, the fees, and the failure paths, not just the happy case.",
      },
      {
        q: "Can you migrate my existing store?",
        a: "Yes — catalog, orders, customers, and SEO redirects. Migration to our hosting is free; store-level migration work is scoped with the project.",
      },
      {
        q: "Will my store stay fast with real traffic?",
        a: "That's the point of building it on hosting we control. LiteSpeed caching plus NVMe storage is our standard stack, and we load-check the store before launch.",
      },
    ],
    ctaLabel: "Start My Store",
    related: [
      { label: "WordPress Hosting", href: "/wordpress-hosting" },
      { label: "Web Development", href: "/web-development" },
      { label: "Domain Search", href: "/domains" },
    ],
  },
  {
    slug: "saas-development",
    name: "SaaS Development",
    eyebrow: "SaaS",
    headline: ["From idea to product", "people pay for."],
    subhead:
      "MVPs and full SaaS products — accounts, billing, dashboards, and APIs — engineered by a team that runs its own subscription software in production.",
    metaTitle: "SaaS Product Development",
    metaDescription:
      "SaaS and MVP development — user accounts, subscription billing, dashboards, and APIs — built by a team that ships and operates its own subscription software.",
    processIntro:
      "SaaS rewards starting small and shipping. We scope the version that proves the idea, build it properly, and grow it from real usage instead of speculation.",
    process: [
      { title: "Scope the MVP", description: "The smallest version that proves someone will pay.", icon: CircuitBoard },
      { title: "Design", description: "The core workflow, designed before decoration.", icon: PenTool },
      { title: "Build", description: "Accounts, data model, and the feature that matters.", icon: Code2 },
      { title: "Billing", description: "Subscriptions and payments wired from day one.", icon: CreditCard },
      { title: "Deploy", description: "Live on infrastructure that scales past the demo.", icon: Cloud },
      { title: "Iterate", description: "Real users, real feedback, weekly releases.", icon: Rocket },
    ],
    offerings: [
      { title: "MVPs", description: "Prove the idea with a real product, not a prototype that gets thrown away.", icon: Rocket },
      { title: "Full SaaS products", description: "Multi-user products with roles, plans, and admin controls.", icon: AppWindow },
      { title: "Subscription billing", description: "Plans, trials, invoices, and dunning — the boring parts done right.", icon: CreditCard },
      { title: "Customer dashboards", description: "The interface your users live in every day.", icon: LayoutDashboard },
      { title: "Public APIs", description: "Let your customers build on your product.", icon: Code2 },
      { title: "Scale engineering", description: "From first user to first thousand without a rewrite.", icon: Gauge },
    ],
    synergy: [
      {
        title: "We run subscription software ourselves",
        description:
          "Our WHMCS modules are licensed monthly and yearly, sold with trials, and supported in production. Billing cycles, license checks, and renewal flows aren't theory here.",
      },
      {
        title: "Infrastructure is in the same building",
        description:
          "Your SaaS deploys onto infrastructure we operate — and moves from shared to VPS as customers arrive, with the same team handling both.",
      },
      {
        title: "Honest MVP scoping",
        description:
          "We'd rather cut scope than pad a quote. The first version's job is proof, and we'll tell you what can wait for version two.",
      },
    ],
    faqs: [
      {
        q: "How long does an MVP take?",
        a: "Depends entirely on the workflow being proven — some MVPs are weeks, some are months. Scoping is the first thing we do together, and you'll have a timeline before any build starts.",
      },
      {
        q: "Do you take equity or just fees?",
        a: "Fees. Your product stays yours — code, data, and IP included.",
      },
      {
        q: "Can you take over an existing half-built product?",
        a: "Usually, after a code review. We'll tell you honestly whether it's faster to rescue or rebuild — and why.",
      },
      {
        q: "What happens when it grows?",
        a: "That's the good problem. Scaling is a hosting conversation we're already in — VPS, optimization, and infrastructure are the SCALE side of what we do.",
      },
    ],
    ctaLabel: "Scope My SaaS",
    related: [
      { label: "App Development", href: "/app-development" },
      { label: "Custom Software", href: "/custom-software" },
      { label: "VPS Hosting", href: "/vps" },
    ],
  },
  {
    slug: "custom-software",
    name: "Custom Software",
    eyebrow: "Custom Software",
    headline: ["Software that fits how", "you actually work."],
    subhead:
      "Internal tools, automation, dashboards, and integrations — including the WHMCS modules we build and sell ourselves. Business outcomes first, technology second.",
    metaTitle: "Custom Software Development",
    metaDescription:
      "Custom software for real business problems — internal tools, automation, dashboards, WHMCS modules, and integrations — from the team that builds and sells its own.",
    processIntro:
      "Custom software starts with the workflow, not the wishlist. We map how work happens today, find the bottleneck, and build the smallest system that removes it.",
    process: [
      { title: "Understand", description: "The workflow, the people, and where time actually goes.", icon: Workflow },
      { title: "Specify", description: "A written scope you can hold us to.", icon: PenTool },
      { title: "Build", description: "The system, in increments you can see working.", icon: Code2 },
      { title: "Integrate", description: "Connected to the tools you already run — billing, CRM, WhatsApp.", icon: Link2 },
      { title: "Deploy", description: "On our infrastructure or yours, documented either way.", icon: Server },
      { title: "Support", description: "Maintained by the people who wrote it.", icon: LifeBuoy },
    ],
    offerings: [
      { title: "Internal tools", description: "The spreadsheet-and-WhatsApp process, turned into software.", icon: LayoutDashboard },
      { title: "Business automation", description: "Repetitive work handled by systems instead of staff.", icon: Workflow },
      { title: "WHMCS modules", description: "Custom modules for hosting businesses — we build and sell our own.", icon: Blocks },
      { title: "Dashboards & reporting", description: "Your numbers, live, in one place.", icon: Gauge },
      { title: "Integrations", description: "Make your existing systems talk to each other.", icon: Link2 },
      { title: "Legacy rescues", description: "Stabilize, document, and modernize the system nobody dares touch.", icon: Wrench },
    ],
    synergy: [
      {
        title: "We ship products, not just projects",
        description:
          "The Gateway Fees & Allocator and WhatsApp Notification modules on this site are our own products — specified, built, documented, sold, and supported by this team. That's the standard your project gets.",
      },
      {
        title: "Deep in the hosting stack",
        description:
          "WHMCS, cPanel, DNS, billing gateways, server automation — the systems most agencies treat as exotic are our daily infrastructure.",
      },
      {
        title: "Outcome-priced scoping",
        description:
          "Every quote is anchored to a written spec of the business outcome — not an hourly meter running on vague requirements.",
      },
    ],
    faqs: [
      {
        q: "What kind of businesses do you build for?",
        a: "Businesses with a workflow problem — agencies, hosting providers, stores, and service companies. If work is stuck in spreadsheets, chats, and copy-paste, that's the shape of project we take.",
      },
      {
        q: "Can you build a custom WHMCS module for my hosting business?",
        a: "Yes — that's our home ground. We build and sell our own WHMCS modules, and custom module work for other providers is a natural extension of it.",
      },
      {
        q: "Do we own the code?",
        a: "Yes. Full source, documentation, and deployment notes are part of delivery. Our own licensed products are the only exception, and that's stated upfront.",
      },
      {
        q: "Can you host it too?",
        a: "That's the point of one partner — build and run in the same place. Your system deploys to our infrastructure with backups and monitoring, or to yours with documentation.",
      },
    ],
    ctaLabel: "Discuss My Project",
    related: [
      { label: "WHMCS Gateway Fees Module", href: "/whmcs-gateway-fees-allocator" },
      { label: "WHMCS WhatsApp Module", href: "/whmcs-whatsapp-notification-module" },
      { label: "SaaS Development", href: "/saas-development" },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
