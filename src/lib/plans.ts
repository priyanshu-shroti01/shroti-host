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
  "Priority support (WhatsApp + tickets)",
];

export const sharedPlans: Plan[] = [
  {
    name: "Bronze",
    tagline: "Get your first website online",
    monthlyPrice: 39,
    monthlyRegularPrice: 89,
    audience: "Students, portfolios, and small websites",
    features: ["1 Website", "10 GB NVMe Storage", "Unmetered Bandwidth", ...sharedFeatures],
    specs: { websites: "1 Website", storage: "10 GB NVMe", email: "1 Mailbox", support: "Priority support (WhatsApp + tickets)" },
    meters: { websites: 1, storageGB: 10, mailboxes: 1 },
    supportTier: "Priority",
  },
  {
    name: "Gold",
    tagline: "The most popular choice",
    monthlyPrice: 79,
    monthlyRegularPrice: 169,
    recommended: true,
    audience: "Startups, freelancers, and small businesses",
    features: ["5 Websites", "50 GB NVMe Storage", "Unmetered Bandwidth", ...sharedFeatures],
    specs: { websites: "5 Websites", storage: "50 GB NVMe", email: "10 Mailboxes", support: "Priority support (WhatsApp + tickets)" },
    meters: { websites: 5, storageGB: 50, mailboxes: 10 },
    supportTier: "Priority",
  },
  {
    name: "Platinum",
    tagline: "Room to grow",
    monthlyPrice: 119,
    monthlyRegularPrice: 249,
    audience: "Agencies and growing businesses",
    features: ["10 Websites", "100 GB NVMe Storage", "Unmetered Bandwidth", ...sharedFeatures],
    specs: { websites: "10 Websites", storage: "100 GB NVMe", email: "Unlimited Mailboxes", support: "Priority support (WhatsApp + tickets)" },
    meters: { websites: 10, storageGB: 100, mailboxes: Infinity },
    supportTier: "Priority",
  },
  {
    name: "Diamond",
    tagline: "Unlimited websites, no ceiling",
    monthlyPrice: 159,
    monthlyRegularPrice: 329,
    audience: "Developers and agencies running many sites",
    features: ["Unlimited Websites", "Unmetered NVMe Storage", "Unmetered Bandwidth", ...sharedFeatures],
    specs: { websites: "Unlimited Websites", storage: "Unmetered NVMe", email: "Unlimited Mailboxes", support: "Priority support (WhatsApp + tickets)" },
    meters: { websites: Infinity, storageGB: Infinity, mailboxes: Infinity },
    supportTier: "Priority",
  },
];

export const wordpressPlans: Plan[] = [
  {
    name: "Bronze",
    tagline: "Get your first WordPress site online",
    monthlyPrice: 39,
    monthlyRegularPrice: 95,
    audience: "First WordPress site, students, and portfolios",
    features: ["1 Website", "10 GB NVMe Storage", "Unmetered Bandwidth", ...sharedFeatures],
    specs: { websites: "1 Website", storage: "10 GB NVMe", email: "1 Mailbox", support: "Priority support (WhatsApp + tickets)" },
    meters: { websites: 1, storageGB: 10, mailboxes: 1 },
    supportTier: "Priority",
  },
  {
    name: "Gold",
    tagline: "The most popular choice",
    monthlyPrice: 79,
    monthlyRegularPrice: 175,
    recommended: true,
    audience: "Small business and freelance WordPress sites",
    features: ["5 Websites", "50 GB NVMe Storage", "Unmetered Bandwidth", ...sharedFeatures],
    specs: { websites: "5 Websites", storage: "50 GB NVMe", email: "10 Mailboxes", support: "Priority support (WhatsApp + tickets)" },
    meters: { websites: 5, storageGB: 50, mailboxes: 10 },
    supportTier: "Priority",
  },
  {
    name: "Platinum",
    tagline: "Room to grow",
    monthlyPrice: 119,
    monthlyRegularPrice: 255,
    audience: "Agencies managing multiple WordPress sites",
    features: ["10 Websites", "100 GB NVMe Storage", "Unmetered Bandwidth", ...sharedFeatures],
    specs: { websites: "10 Websites", storage: "100 GB NVMe", email: "Unlimited Mailboxes", support: "Priority support (WhatsApp + tickets)" },
    meters: { websites: 10, storageGB: 100, mailboxes: Infinity },
    supportTier: "Priority",
  },
  {
    name: "Diamond",
    tagline: "Unlimited WordPress sites",
    monthlyPrice: 159,
    monthlyRegularPrice: 335,
    audience: "WordPress developers and agencies",
    features: ["Unlimited Websites", "Unmetered NVMe Storage", "Unmetered Bandwidth", ...sharedFeatures],
    specs: { websites: "Unlimited Websites", storage: "Unmetered NVMe", email: "Unlimited Mailboxes", support: "Priority support (WhatsApp + tickets)" },
    meters: { websites: Infinity, storageGB: Infinity, mailboxes: Infinity },
    supportTier: "Priority",
  },
];

export const unlimitedPlans: Plan[] = [
  {
    name: "Bronze",
    tagline: "One site, unmetered everything",
    monthlyPrice: 69,
    monthlyRegularPrice: 159,
    audience: "One website that shouldn't worry about storage caps",
    features: ["1 Website", "Unmetered NVMe Storage", "Unmetered Bandwidth", ...sharedFeatures],
    specs: { websites: "1 Website", storage: "Unmetered NVMe", email: "1 Mailbox", support: "Priority support (WhatsApp + tickets)" },
    meters: { websites: 1, storageGB: Infinity, mailboxes: 1 },
    supportTier: "Priority",
  },
  {
    name: "Gold",
    tagline: "The most popular choice",
    monthlyPrice: 109,
    monthlyRegularPrice: 259,
    recommended: true,
    audience: "A handful of sites, all unmetered",
    features: ["3 Websites", "Unmetered NVMe Storage", "Unmetered Bandwidth", ...sharedFeatures],
    specs: { websites: "3 Websites", storage: "Unmetered NVMe", email: "10 Mailboxes", support: "Priority support (WhatsApp + tickets)" },
    meters: { websites: 3, storageGB: Infinity, mailboxes: 10 },
    supportTier: "Priority",
  },
  {
    name: "Platinum",
    tagline: "Room to grow",
    monthlyPrice: 139,
    monthlyRegularPrice: 339,
    audience: "Growing portfolios of sites",
    features: ["5 Websites", "Unmetered NVMe Storage", "Unmetered Bandwidth", ...sharedFeatures],
    specs: { websites: "5 Websites", storage: "Unmetered NVMe", email: "Unlimited Mailboxes", support: "Priority support (WhatsApp + tickets)" },
    meters: { websites: 5, storageGB: Infinity, mailboxes: Infinity },
    supportTier: "Priority",
  },
  {
    name: "Diamond",
    tagline: "As many sites as you run",
    monthlyPrice: 179,
    monthlyRegularPrice: 429,
    audience: "Agencies and developers hosting many sites on one plan",
    features: ["Unlimited Websites", "Unmetered NVMe Storage", "Unmetered Bandwidth", ...sharedFeatures],
    specs: { websites: "Unlimited Websites", storage: "Unmetered NVMe", email: "Unlimited Mailboxes", support: "Priority support (WhatsApp + tickets)" },
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
  "Priority support (WhatsApp + tickets)",
];

export const resellerPlans: Plan[] = [
  {
    name: "Bronze",
    tagline: "Start your hosting business",
    monthlyPrice: 229,
    monthlyRegularPrice: 549,
    audience: "First-time resellers starting a hosting business",
    features: ["50 cPanel Accounts", "50 GB NVMe Storage", "Unmetered Bandwidth", ...resellerFeatures],
    specs: { websites: "50 cPanel Accounts", storage: "50 GB NVMe", email: "Unlimited Mailboxes", support: "Priority support (WhatsApp + tickets)" },
    meters: { websites: 50, storageGB: 50, mailboxes: Infinity },
    supportTier: "Priority",
  },
  {
    name: "Gold",
    tagline: "The most popular choice",
    monthlyPrice: 449,
    monthlyRegularPrice: 999,
    recommended: true,
    audience: "Growing reseller businesses",
    features: ["150 cPanel Accounts", "150 GB NVMe Storage", "Unmetered Bandwidth", ...resellerFeatures],
    specs: { websites: "150 cPanel Accounts", storage: "150 GB NVMe", email: "Unlimited Mailboxes", support: "Priority support (WhatsApp + tickets)" },
    meters: { websites: 150, storageGB: 150, mailboxes: Infinity },
    supportTier: "Priority",
  },
  {
    name: "Platinum",
    tagline: "Room to grow",
    monthlyPrice: 649,
    monthlyRegularPrice: 1449,
    audience: "Established reseller businesses",
    features: ["350 cPanel Accounts", "350 GB NVMe Storage", "Unmetered Bandwidth", ...resellerFeatures],
    specs: { websites: "350 cPanel Accounts", storage: "350 GB NVMe", email: "Unlimited Mailboxes", support: "Priority support (WhatsApp + tickets)" },
    meters: { websites: 350, storageGB: 350, mailboxes: Infinity },
    supportTier: "Priority",
  },
  {
    name: "Diamond",
    tagline: "Unlimited cPanel accounts",
    monthlyPrice: 899,
    monthlyRegularPrice: 1999,
    audience: "Large-scale reseller operations",
    features: ["Unlimited cPanel Accounts", "Unmetered NVMe Storage", "Unmetered Bandwidth", ...resellerFeatures],
    specs: { websites: "Unlimited cPanel Accounts", storage: "Unmetered NVMe", email: "Unlimited Mailboxes", support: "Priority support (WhatsApp + tickets)" },
    meters: { websites: Infinity, storageGB: Infinity, mailboxes: Infinity },
    supportTier: "Priority",
  },
];

export const masterResellerPlans: Plan[] = [
  {
    name: "Bronze",
    tagline: "Create your own resellers",
    monthlyPrice: 349,
    monthlyRegularPrice: 799,
    audience: "Reseller businesses ready to create sub-resellers",
    features: ["100 cPanel Accounts", "10 WHM Reseller Accounts", "100 GB NVMe Storage", "Unmetered Bandwidth", ...resellerFeatures],
    specs: { websites: "100 cPanel Accounts", storage: "100 GB NVMe", email: "Unlimited Mailboxes", support: "Priority support (WhatsApp + tickets)" },
    meters: { websites: 100, storageGB: 100, mailboxes: Infinity },
    supportTier: "Priority",
    additionalMeters: [{ label: "WHM Reseller Accounts", valueLabel: "10 Accounts", value: 10 }],
  },
  {
    name: "Gold",
    tagline: "The most popular choice",
    monthlyPrice: 699,
    monthlyRegularPrice: 1549,
    recommended: true,
    audience: "Growing master reseller operations",
    features: ["350 cPanel Accounts", "100 WHM Reseller Accounts", "350 GB NVMe Storage", "Unmetered Bandwidth", ...resellerFeatures],
    specs: { websites: "350 cPanel Accounts", storage: "350 GB NVMe", email: "Unlimited Mailboxes", support: "Priority support (WhatsApp + tickets)" },
    meters: { websites: 350, storageGB: 350, mailboxes: Infinity },
    supportTier: "Priority",
    additionalMeters: [{ label: "WHM Reseller Accounts", valueLabel: "100 Accounts", value: 100 }],
  },
  {
    name: "Platinum",
    tagline: "Room to grow",
    monthlyPrice: 999,
    monthlyRegularPrice: 2249,
    audience: "Established master reseller operations",
    features: ["550 cPanel Accounts", "150 WHM Reseller Accounts", "550 GB NVMe Storage", "Unmetered Bandwidth", ...resellerFeatures],
    specs: { websites: "550 cPanel Accounts", storage: "550 GB NVMe", email: "Unlimited Mailboxes", support: "Priority support (WhatsApp + tickets)" },
    meters: { websites: 550, storageGB: 550, mailboxes: Infinity },
    supportTier: "Priority",
    additionalMeters: [{ label: "WHM Reseller Accounts", valueLabel: "150 Accounts", value: 150 }],
  },
  {
    name: "Diamond",
    tagline: "Unlimited resellers",
    monthlyPrice: 1349,
    monthlyRegularPrice: 2999,
    audience: "Large-scale master reseller businesses",
    features: ["Unlimited cPanel Accounts", "Unlimited WHM Reseller Accounts", "Unmetered NVMe Storage", "Unmetered Bandwidth", ...resellerFeatures],
    specs: { websites: "Unlimited cPanel Accounts", storage: "Unmetered NVMe", email: "Unlimited Mailboxes", support: "Priority support (WhatsApp + tickets)" },
    meters: { websites: Infinity, storageGB: Infinity, mailboxes: Infinity },
    supportTier: "Priority",
    additionalMeters: [{ label: "WHM Reseller Accounts", valueLabel: "Unlimited", value: Infinity }],
  },
];

export const alphaResellerPlans: Plan[] = [
  {
    name: "Bronze",
    tagline: "Elite tier — build resellers of resellers",
    monthlyPrice: 649,
    monthlyRegularPrice: 1599,
    audience: "Master resellers ready to create their own reseller network",
    features: ["100 cPanel Accounts", "10 WHM Reseller Accounts", "10 Master Reseller Accounts", "100 GB NVMe Storage", "Unmetered Bandwidth", ...resellerFeatures],
    specs: { websites: "100 cPanel Accounts", storage: "100 GB NVMe", email: "Unlimited Mailboxes", support: "Priority support (WhatsApp + tickets)" },
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
    monthlyPrice: 1099,
    monthlyRegularPrice: 2449,
    recommended: true,
    audience: "Growing multi-level reseller networks",
    features: ["350 cPanel Accounts", "100 WHM Reseller Accounts", "100 Master Reseller Accounts", "350 GB NVMe Storage", "Unmetered Bandwidth", ...resellerFeatures],
    specs: { websites: "350 cPanel Accounts", storage: "350 GB NVMe", email: "Unlimited Mailboxes", support: "Priority support (WhatsApp + tickets)" },
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
    monthlyPrice: 1549,
    monthlyRegularPrice: 3499,
    audience: "Established multi-level reseller networks",
    features: ["500 cPanel Accounts", "150 WHM Reseller Accounts", "150 Master Reseller Accounts", "550 GB NVMe Storage", "Unmetered Bandwidth", ...resellerFeatures],
    specs: { websites: "500 cPanel Accounts", storage: "550 GB NVMe", email: "Unlimited Mailboxes", support: "Priority support (WhatsApp + tickets)" },
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
    monthlyPrice: 1999,
    monthlyRegularPrice: 4449,
    audience: "The largest, most demanding reseller networks",
    features: ["Unlimited cPanel Accounts", "Unlimited WHM Reseller Accounts", "Unlimited Master Reseller Accounts", "Unmetered NVMe Storage", "Unmetered Bandwidth", ...resellerFeatures],
    specs: { websites: "Unlimited cPanel Accounts", storage: "Unmetered NVMe", email: "Unlimited Mailboxes", support: "Priority support (WhatsApp + tickets)" },
    meters: { websites: Infinity, storageGB: Infinity, mailboxes: Infinity },
    supportTier: "Priority",
    additionalMeters: [
      { label: "WHM Reseller Accounts", valueLabel: "Unlimited", value: Infinity },
      { label: "Master Reseller Accounts", valueLabel: "Unlimited", value: Infinity },
    ],
  },
];
