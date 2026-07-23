export type Plan = {
  name: string;
  tagline: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  annualPrice: number;
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
};

export const plans: Plan[] = [
  {
    name: "Launch",
    tagline: "Get your first website online",
    monthlyPrice: 129,
    quarterlyPrice: 109,
    annualPrice: 89,
    audience: "Students, portfolios, and small websites",
    features: [
      "1 Website",
      "10 GB NVMe Storage",
      "Free SSL Certificate",
      "LiteSpeed Web Server",
      "Daily Backups",
      "Free Migration",
    ],
    specs: {
      websites: "1 Website",
      storage: "10 GB NVMe",
      email: "1 Mailbox",
      support: "Standard Support",
    },
    meters: { websites: 1, storageGB: 10, mailboxes: 1 },
    supportTier: "Standard",
  },
  {
    name: "Grow",
    tagline: "The most popular choice",
    monthlyPrice: 219,
    quarterlyPrice: 185,
    annualPrice: 149,
    recommended: true,
    audience: "Startups, freelancers, and small businesses",
    features: [
      "10 Websites",
      "50 GB NVMe Storage",
      "Free SSL Certificate",
      "LiteSpeed + AccelerateWP",
      "Daily Backups",
      "Free Migration",
      "Business Email",
      "Priority Support",
    ],
    specs: {
      websites: "10 Websites",
      storage: "50 GB NVMe",
      email: "10 Mailboxes",
      support: "Priority Support",
    },
    meters: { websites: 10, storageGB: 50, mailboxes: 10 },
    supportTier: "Priority",
  },
  {
    name: "Scale",
    tagline: "Room to grow without limits",
    monthlyPrice: 379,
    quarterlyPrice: 319,
    annualPrice: 269,
    audience: "Agencies, developers, and growing businesses",
    features: [
      "Unlimited Websites",
      "150 GB NVMe Storage",
      "Free SSL Certificate",
      "LiteSpeed + AccelerateWP",
      "Daily Backups",
      "Free Migration",
      "Business Email",
      "Priority Performance",
      "Priority Support",
    ],
    specs: {
      websites: "Unlimited Websites",
      storage: "150 GB NVMe",
      email: "Unlimited Mailboxes",
      support: "Priority Support",
    },
    meters: { websites: Infinity, storageGB: 150, mailboxes: Infinity },
    supportTier: "Priority",
  },
];

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
