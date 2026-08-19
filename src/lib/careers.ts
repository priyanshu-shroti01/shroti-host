/**
 * Open roles — EDIT THIS FILE to add/remove/close roles; the /careers page,
 * footer link and JobPosting structured data all render from here. An empty
 * array switches the page to "no openings right now" + open-application mode.
 *
 * Applications go to email (subject prefilled per role) and WhatsApp — no ATS.
 */
export type CareerRole = {
  slug: string;
  title: string;
  team: "Support" | "Engineering" | "Growth";
  type: "Full-time" | "Part-time" | "Internship";
  location: string;
  /** ISO date the role was opened — used in JobPosting structured data. */
  posted: string;
  summary: string;
  responsibilities: string[];
  lookingFor: string[];
};

export const CAREERS_EMAIL = "support@shrotihost.in";
export const CAREERS_WHATSAPP = "https://wa.me/919582129099";

export const openRoles: CareerRole[] = [
  {
    slug: "linux-support-engineer",
    title: "Linux Support Engineer",
    team: "Support",
    type: "Full-time",
    location: "Remote · India",
    posted: "2026-08-17",
    summary:
      "Front line for our customers — cPanel/WHM, DNS, SSL and migrations. You keep real websites online and reply like a human, not a script.",
    responsibilities: [
      "Resolve hosting tickets end-to-end (cPanel/WHM, DNS, email, SSL)",
      "Run free customer migrations with zero downtime",
      "Escalate and document platform-level issues",
    ],
    lookingFor: [
      "Comfortable in a Linux shell (logs, permissions, services)",
      "Hands-on with cPanel/WHM or similar panels",
      "Clear written English + Hindi communication",
    ],
  },
  {
    slug: "nodejs-nextjs-developer",
    title: "Node.js / Next.js Developer",
    team: "Engineering",
    type: "Full-time",
    location: "Remote · India",
    posted: "2026-08-17",
    summary:
      "Build the products around the hosting — this website, WHMCS modules, internal tooling and automation that keeps the platform humming.",
    responsibilities: [
      "Ship features across our Next.js site and WHMCS integrations",
      "Automate provisioning, monitoring and billing workflows",
      "Own quality: tests, performance budgets, accessibility",
    ],
    lookingFor: [
      "Solid TypeScript/React and Node.js fundamentals",
      "PHP familiarity a plus (WHMCS modules)",
      "Bias for shipping small, verified changes",
    ],
  },
  {
    slug: "wordpress-migration-specialist",
    title: "WordPress Migration Specialist",
    team: "Support",
    type: "Part-time",
    location: "Remote · India",
    posted: "2026-08-17",
    summary:
      "Move customer WordPress sites onto our stack — cleanly, quickly, and with the LiteSpeed cache tuned before handover.",
    responsibilities: [
      "Migrate WordPress/WooCommerce sites from other hosts",
      "Tune LSCache, PHP versions and object caching per site",
      "Verify every migration with a launch checklist",
    ],
    lookingFor: [
      "Deep WordPress experience (DB, wp-cli, plugins)",
      "Understanding of DNS cutovers and SSL",
      "Meticulous about verification before closing a ticket",
    ],
  },
];

/** The hiring loop — rendered as the site's canonical checklist pattern. */
export const hiringSteps = [
  { title: "Apply", text: "Email or WhatsApp us — a short note about what you've built beats a formal CV." },
  { title: "Intro chat", text: "30 minutes with the founders. We talk shop, you ask anything." },
  { title: "Paid trial task", text: "A small, real task from our actual backlog — paid, scoped to a few hours." },
  { title: "Offer", text: "Fast decision, clear terms. Most loops finish inside a week." },
];

export const whyJoin = [
  { title: "Real infrastructure", text: "Your work keeps live customer websites online — feedback is immediate and honest." },
  { title: "Remote-first", text: "Work from anywhere in India. Async by default, WhatsApp when it's urgent." },
  { title: "Small team, big surface", text: "Servers, product, support, growth — you'll touch all of it and own outcomes." },
  { title: "Learn the whole stack", text: "cPanel to CDN, DNS to Next.js — the full path a request travels, in production." },
];
