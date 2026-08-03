/**
 * Real per-tier pricing model: each plan has one current promotional monthly
 * rate (`monthlyPrice`) and the "regular" rate it's discounted from
 * (`monthlyRegularPrice`). Quarterly/semi-annual/annual totals are the
 * monthly rate multiplied by the cycle length — there is no separate,
 * larger discount for prepaying longer; the saved amount instead comes from
 * choosing to pay less often but with the exact same "same renewal price"
 * guarantee at every cycle. This mirrors the actual billing model these
 * catalogs are priced against, rather than an invented escalating-discount
 * scheme.
 */
export type Cycle = "monthly" | "quarterly" | "semiAnnual" | "annual";

export const cycleMonths: Record<Cycle, number> = {
  monthly: 1,
  quarterly: 3,
  semiAnnual: 6,
  annual: 12,
};

export type Plan = {
  name: string;
  tagline: string;
  monthlyPrice: number;
  monthlyRegularPrice: number;
  recommended?: boolean;
  audience: string;
  features: string[];
  specs: {
    websites: string;
    storage: string;
    email: string;
    support: string;
  };
  /** Raw values driving the plan comparison meters — Infinity renders as an "unlimited" fill, not a proportional bar. */
  meters: {
    websites: number;
    storageGB: number;
    mailboxes: number;
  };
  supportTier: "Standard" | "Priority";
  /** Reseller-line plans meter extra account tiers (WHM reseller accounts, Master Reseller accounts) beyond the primary cPanel-account meter. */
  additionalMeters?: { label: string; valueLabel: string; value: number }[];
};

export function priceForCycle(plan: Plan, cycle: Cycle) {
  const months = cycleMonths[cycle];
  return { sale: plan.monthlyPrice * months, regular: plan.monthlyRegularPrice * months };
}

export function savePercent(plan: Plan): number {
  return Math.round((1 - plan.monthlyPrice / plan.monthlyRegularPrice) * 100);
}

/** Features present on every tier of every hosting line — the real, shared baseline. */
export const commonFeatures = [
  "Free SSL",
  "LiteSpeed Web Server",
  "CloudLinux",
  "Daily Backups",
  "Imunify360 Security",
  "Free Migration",
  "Softaculous Apps",
  "Node.js, Python & PHP",
];

const sharedFeatures = [
  "Free SSL Certificate",
  "Free Migration",
  "Daily Backups",
  "cPanel + Softaculous",
  "Managed WordPress",
  "DDoS & Imunify360 Protection",
  "Python, Node.js & Ruby Supported",
  "Terminal Access",
  "Instant Activation",
  "24/7 Priority Support",
];

export const sharedPlans: Plan[] = [
  {
    name: "Bronze",
    tagline: "Get your first website online",
    monthlyPrice: 29,
    monthlyRegularPrice: 69,
    audience: "Students, portfolios, and small websites",
    features: ["1 Website", "10 GB NVMe Storage", "Unmetered Bandwidth", ...sharedFeatures],
    specs: { websites: "1 Website", storage: "10 GB NVMe", email: "1 Mailbox", support: "24/7 Priority Support" },
    meters: { websites: 1, storageGB: 10, mailboxes: 1 },
    supportTier: "Priority",
  },
  {
    name: "Gold",
    tagline: "The most popular choice",
    monthlyPrice: 69,
    monthlyRegularPrice: 139,
    recommended: true,
    audience: "Startups, freelancers, and small businesses",
    features: ["5 Websites", "50 GB NVMe Storage", "Unmetered Bandwidth", ...sharedFeatures],
    specs: { websites: "5 Websites", storage: "50 GB NVMe", email: "10 Mailboxes", support: "24/7 Priority Support" },
    meters: { websites: 5, storageGB: 50, mailboxes: 10 },
    supportTier: "Priority",
  },
  {
    name: "Platinum",
    tagline: "Room to grow",
    monthlyPrice: 99,
    monthlyRegularPrice: 210,
    audience: "Agencies and growing businesses",
    features: ["10 Websites", "100 GB NVMe Storage", "Unmetered Bandwidth", ...sharedFeatures],
    specs: { websites: "10 Websites", storage: "100 GB NVMe", email: "Unlimited Mailboxes", support: "24/7 Priority Support" },
    meters: { websites: 10, storageGB: 100, mailboxes: Infinity },
    supportTier: "Priority",
  },
  {
    name: "Diamond",
    tagline: "Unlimited websites, no ceiling",
    monthlyPrice: 129,
    monthlyRegularPrice: 280,
    audience: "Developers and agencies running many sites",
    features: ["Unlimited Websites", "Unmetered NVMe Storage", "Unmetered Bandwidth", ...sharedFeatures],
    specs: { websites: "Unlimited Websites", storage: "Unmetered NVMe", email: "Unlimited Mailboxes", support: "24/7 Priority Support" },
    meters: { websites: Infinity, storageGB: Infinity, mailboxes: Infinity },
    supportTier: "Priority",
  },
];

export const wordpressPlans: Plan[] = [
  {
    name: "Bronze",
    tagline: "Get your first WordPress site online",
    monthlyPrice: 29,
    monthlyRegularPrice: 70,
    audience: "First WordPress site, students, and portfolios",
    features: ["1 Website", "10 GB NVMe Storage", "Unmetered Bandwidth", ...sharedFeatures],
    specs: { websites: "1 Website", storage: "10 GB NVMe", email: "1 Mailbox", support: "24/7 Priority Support" },
    meters: { websites: 1, storageGB: 10, mailboxes: 1 },
    supportTier: "Priority",
  },
  {
    name: "Gold",
    tagline: "The most popular choice",
    monthlyPrice: 69,
    monthlyRegularPrice: 140,
    recommended: true,
    audience: "Small business and freelance WordPress sites",
    features: ["5 Websites", "50 GB NVMe Storage", "Unmetered Bandwidth", ...sharedFeatures],
    specs: { websites: "5 Websites", storage: "50 GB NVMe", email: "10 Mailboxes", support: "24/7 Priority Support" },
    meters: { websites: 5, storageGB: 50, mailboxes: 10 },
    supportTier: "Priority",
  },
  {
    name: "Platinum",
    tagline: "Room to grow",
    monthlyPrice: 99,
    monthlyRegularPrice: 210,
    audience: "Agencies managing multiple WordPress sites",
    features: ["10 Websites", "100 GB NVMe Storage", "Unmetered Bandwidth", ...sharedFeatures],
    specs: { websites: "10 Websites", storage: "100 GB NVMe", email: "Unlimited Mailboxes", support: "24/7 Priority Support" },
    meters: { websites: 10, storageGB: 100, mailboxes: Infinity },
    supportTier: "Priority",
  },
  {
    name: "Diamond",
    tagline: "Unlimited WordPress sites",
    monthlyPrice: 129,
    monthlyRegularPrice: 280,
    audience: "WordPress developers and agencies",
    features: ["Unlimited Websites", "Unmetered NVMe Storage", "Unmetered Bandwidth", ...sharedFeatures],
    specs: { websites: "Unlimited Websites", storage: "Unmetered NVMe", email: "Unlimited Mailboxes", support: "24/7 Priority Support" },
    meters: { websites: Infinity, storageGB: Infinity, mailboxes: Infinity },
    supportTier: "Priority",
  },
];

export const unlimitedPlans: Plan[] = [
  {
    name: "Bronze",
    tagline: "One site, unmetered everything",
    monthlyPrice: 49,
    monthlyRegularPrice: 120,
    audience: "One website that shouldn't worry about storage caps",
    features: ["1 Website", "Unmetered NVMe Storage", "Unmetered Bandwidth", ...sharedFeatures],
    specs: { websites: "1 Website", storage: "Unmetered NVMe", email: "1 Mailbox", support: "24/7 Priority Support" },
    meters: { websites: 1, storageGB: Infinity, mailboxes: 1 },
    supportTier: "Priority",
  },
  {
    name: "Gold",
    tagline: "The most popular choice",
    monthlyPrice: 79,
    monthlyRegularPrice: 240,
    recommended: true,
    audience: "A handful of sites, all unmetered",
    features: ["3 Websites", "Unmetered NVMe Storage", "Unmetered Bandwidth", ...sharedFeatures],
    specs: { websites: "3 Websites", storage: "Unmetered NVMe", email: "10 Mailboxes", support: "24/7 Priority Support" },
    meters: { websites: 3, storageGB: Infinity, mailboxes: 10 },
    supportTier: "Priority",
  },
  {
    name: "Platinum",
    tagline: "Room to grow",
    monthlyPrice: 99,
    monthlyRegularPrice: 360,
    audience: "Growing portfolios of sites",
    features: ["5 Websites", "Unmetered NVMe Storage", "Unmetered Bandwidth", ...sharedFeatures],
    specs: { websites: "5 Websites", storage: "Unmetered NVMe", email: "Unlimited Mailboxes", support: "24/7 Priority Support" },
    meters: { websites: 5, storageGB: Infinity, mailboxes: Infinity },
    supportTier: "Priority",
  },
  {
    name: "Diamond",
    tagline: "As many sites as you run",
    monthlyPrice: 129,
    monthlyRegularPrice: 480,
    audience: "Agencies and developers hosting many sites on one plan",
    features: ["Unlimited Websites", "Unmetered NVMe Storage", "Unmetered Bandwidth", ...sharedFeatures],
    specs: { websites: "Unlimited Websites", storage: "Unmetered NVMe", email: "Unlimited Mailboxes", support: "24/7 Priority Support" },
    meters: { websites: Infinity, storageGB: Infinity, mailboxes: Infinity },
    supportTier: "Priority",
  },
];

const resellerFeatures = [
  "Free SSL Certificate",
  "Free Migration",
  "Daily Backups with JetBackup",
  "LiteSpeed Server",
  "cPanel + Softaculous",
  "Managed WordPress",
  "DDoS & Imunify360 Protection",
  "Python, Node.js & Ruby Supported",
  "Terminal Access",
  "Free WHMCS Billing Software",
  "Instant Activation",
  "24/7 Priority Support",
];

export const resellerPlans: Plan[] = [
  {
    name: "Bronze",
    tagline: "Start your hosting business",
    monthlyPrice: 199,
    monthlyRegularPrice: 500,
    audience: "First-time resellers starting a hosting business",
    features: ["50 cPanel Accounts", "50 GB NVMe Storage", "Unmetered Bandwidth", ...resellerFeatures],
    specs: { websites: "50 cPanel Accounts", storage: "50 GB NVMe", email: "Unlimited Mailboxes", support: "24/7 Priority Support" },
    meters: { websites: 50, storageGB: 50, mailboxes: Infinity },
    supportTier: "Priority",
  },
  {
    name: "Gold",
    tagline: "The most popular choice",
    monthlyPrice: 399,
    monthlyRegularPrice: 900,
    recommended: true,
    audience: "Growing reseller businesses",
    features: ["150 cPanel Accounts", "150 GB NVMe Storage", "Unmetered Bandwidth", ...resellerFeatures],
    specs: { websites: "150 cPanel Accounts", storage: "150 GB NVMe", email: "Unlimited Mailboxes", support: "24/7 Priority Support" },
    meters: { websites: 150, storageGB: 150, mailboxes: Infinity },
    supportTier: "Priority",
  },
  {
    name: "Platinum",
    tagline: "Room to grow",
    monthlyPrice: 599,
    monthlyRegularPrice: 1300,
    audience: "Established reseller businesses",
    features: ["350 cPanel Accounts", "350 GB NVMe Storage", "Unmetered Bandwidth", ...resellerFeatures],
    specs: { websites: "350 cPanel Accounts", storage: "350 GB NVMe", email: "Unlimited Mailboxes", support: "24/7 Priority Support" },
    meters: { websites: 350, storageGB: 350, mailboxes: Infinity },
    supportTier: "Priority",
  },
  {
    name: "Diamond",
    tagline: "Unlimited cPanel accounts",
    monthlyPrice: 799,
    monthlyRegularPrice: 1800,
    audience: "Large-scale reseller operations",
    features: ["Unlimited cPanel Accounts", "Unmetered NVMe Storage", "Unmetered Bandwidth", ...resellerFeatures],
    specs: { websites: "Unlimited cPanel Accounts", storage: "Unmetered NVMe", email: "Unlimited Mailboxes", support: "24/7 Priority Support" },
    meters: { websites: Infinity, storageGB: Infinity, mailboxes: Infinity },
    supportTier: "Priority",
  },
];

export const masterResellerPlans: Plan[] = [
  {
    name: "Bronze",
    tagline: "Create your own resellers",
    monthlyPrice: 299,
    monthlyRegularPrice: 700,
    audience: "Reseller businesses ready to create sub-resellers",
    features: ["100 cPanel Accounts", "10 WHM Reseller Accounts", "100 GB NVMe Storage", "Unmetered Bandwidth", ...resellerFeatures],
    specs: { websites: "100 cPanel Accounts", storage: "100 GB NVMe", email: "Unlimited Mailboxes", support: "24/7 Priority Support" },
    meters: { websites: 100, storageGB: 100, mailboxes: Infinity },
    supportTier: "Priority",
    additionalMeters: [{ label: "WHM Reseller Accounts", valueLabel: "10 Accounts", value: 10 }],
  },
  {
    name: "Gold",
    tagline: "The most popular choice",
    monthlyPrice: 599,
    monthlyRegularPrice: 1400,
    recommended: true,
    audience: "Growing master reseller operations",
    features: ["350 cPanel Accounts", "100 WHM Reseller Accounts", "350 GB NVMe Storage", "Unmetered Bandwidth", ...resellerFeatures],
    specs: { websites: "350 cPanel Accounts", storage: "350 GB NVMe", email: "Unlimited Mailboxes", support: "24/7 Priority Support" },
    meters: { websites: 350, storageGB: 350, mailboxes: Infinity },
    supportTier: "Priority",
    additionalMeters: [{ label: "WHM Reseller Accounts", valueLabel: "100 Accounts", value: 100 }],
  },
  {
    name: "Platinum",
    tagline: "Room to grow",
    monthlyPrice: 899,
    monthlyRegularPrice: 2000,
    audience: "Established master reseller operations",
    features: ["550 cPanel Accounts", "150 WHM Reseller Accounts", "550 GB NVMe Storage", "Unmetered Bandwidth", ...resellerFeatures],
    specs: { websites: "550 cPanel Accounts", storage: "550 GB NVMe", email: "Unlimited Mailboxes", support: "24/7 Priority Support" },
    meters: { websites: 550, storageGB: 550, mailboxes: Infinity },
    supportTier: "Priority",
    additionalMeters: [{ label: "WHM Reseller Accounts", valueLabel: "150 Accounts", value: 150 }],
  },
  {
    name: "Diamond",
    tagline: "Unlimited resellers",
    monthlyPrice: 1199,
    monthlyRegularPrice: 2800,
    audience: "Large-scale master reseller businesses",
    features: ["Unlimited cPanel Accounts", "Unlimited WHM Reseller Accounts", "Unmetered NVMe Storage", "Unmetered Bandwidth", ...resellerFeatures],
    specs: { websites: "Unlimited cPanel Accounts", storage: "Unmetered NVMe", email: "Unlimited Mailboxes", support: "24/7 Priority Support" },
    meters: { websites: Infinity, storageGB: Infinity, mailboxes: Infinity },
    supportTier: "Priority",
    additionalMeters: [{ label: "WHM Reseller Accounts", valueLabel: "Unlimited", value: Infinity }],
  },
];

export const alphaResellerPlans: Plan[] = [
  {
    name: "Bronze",
    tagline: "Elite tier — build resellers of resellers",
    monthlyPrice: 599,
    monthlyRegularPrice: 1500,
    audience: "Master resellers ready to create their own reseller network",
    features: ["100 cPanel Accounts", "10 WHM Reseller Accounts", "10 Master Reseller Accounts", "100 GB NVMe Storage", "Unmetered Bandwidth", ...resellerFeatures],
    specs: { websites: "100 cPanel Accounts", storage: "100 GB NVMe", email: "Unlimited Mailboxes", support: "24/7 Priority Support" },
    meters: { websites: 100, storageGB: 100, mailboxes: Infinity },
    supportTier: "Priority",
    additionalMeters: [
      { label: "WHM Reseller Accounts", valueLabel: "10 Accounts", value: 10 },
      { label: "Master Reseller Accounts", valueLabel: "10 Accounts", value: 10 },
    ],
  },
  {
    name: "Gold",
    tagline: "The most popular choice",
    monthlyPrice: 999,
    monthlyRegularPrice: 2200,
    recommended: true,
    audience: "Growing multi-level reseller networks",
    features: ["350 cPanel Accounts", "100 WHM Reseller Accounts", "100 Master Reseller Accounts", "350 GB NVMe Storage", "Unmetered Bandwidth", ...resellerFeatures],
    specs: { websites: "350 cPanel Accounts", storage: "350 GB NVMe", email: "Unlimited Mailboxes", support: "24/7 Priority Support" },
    meters: { websites: 350, storageGB: 350, mailboxes: Infinity },
    supportTier: "Priority",
    additionalMeters: [
      { label: "WHM Reseller Accounts", valueLabel: "100 Accounts", value: 100 },
      { label: "Master Reseller Accounts", valueLabel: "100 Accounts", value: 100 },
    ],
  },
  {
    name: "Platinum",
    tagline: "Room to grow",
    monthlyPrice: 1399,
    monthlyRegularPrice: 3200,
    audience: "Established multi-level reseller networks",
    features: ["500 cPanel Accounts", "150 WHM Reseller Accounts", "150 Master Reseller Accounts", "550 GB NVMe Storage", "Unmetered Bandwidth", ...resellerFeatures],
    specs: { websites: "500 cPanel Accounts", storage: "550 GB NVMe", email: "Unlimited Mailboxes", support: "24/7 Priority Support" },
    meters: { websites: 500, storageGB: 550, mailboxes: Infinity },
    supportTier: "Priority",
    additionalMeters: [
      { label: "WHM Reseller Accounts", valueLabel: "150 Accounts", value: 150 },
      { label: "Master Reseller Accounts", valueLabel: "150 Accounts", value: 150 },
    ],
  },
  {
    name: "Diamond",
    tagline: "Maximum resources, elite tier",
    monthlyPrice: 1799,
    monthlyRegularPrice: 4000,
    audience: "The largest, most demanding reseller networks",
    features: ["Unlimited cPanel Accounts", "Unlimited WHM Reseller Accounts", "Unlimited Master Reseller Accounts", "Unmetered NVMe Storage", "Unmetered Bandwidth", ...resellerFeatures],
    specs: { websites: "Unlimited cPanel Accounts", storage: "Unmetered NVMe", email: "Unlimited Mailboxes", support: "24/7 Priority Support" },
    meters: { websites: Infinity, storageGB: Infinity, mailboxes: Infinity },
    supportTier: "Priority",
    additionalMeters: [
      { label: "WHM Reseller Accounts", valueLabel: "Unlimited", value: Infinity },
      { label: "Master Reseller Accounts", valueLabel: "Unlimited", value: Infinity },
    ],
  },
];
