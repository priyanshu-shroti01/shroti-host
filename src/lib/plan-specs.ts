import type { Plan } from "@/lib/plans";

/**
 * Full per-tier spec matrices for the product pages — the RankHostZone-style
 * "every number in the open" tables. Per-tier values are derived from
 * lib/plans.ts so the table can never disagree with the plan cards; the
 * platform-level values (RAM, CPU, process limits, email rates) are the
 * catalog's published limits, identical across tiers unless listed.
 */

export type SpecRow = {
  label: string;
  /** One value per tier, or a single value applied to all tiers. */
  values: string[] | string;
};

export type SpecGroup = {
  title: string;
  rows: SpecRow[];
};

const CHECK = "✓";

const perTier = (plans: Plan[], pick: (p: Plan) => string) => plans.map(pick);

/** Shared, WordPress, and Unlimited lines share one platform spec set. */
export function hostingSpecGroups(plans: Plan[]): SpecGroup[] {
  return [
    {
      title: "Resources",
      rows: [
        { label: "Websites", values: perTier(plans, (p) => p.specs.websites) },
        { label: "NVMe SSD Storage", values: perTier(plans, (p) => p.specs.storage) },
        { label: "Bandwidth", values: "Unmetered" },
        { label: "Inodes", values: "Unlimited" },
        { label: "RAM", values: "Up to 8 GB" },
        { label: "CPU", values: "Up to 4 cores" },
        { label: "Entry Processes", values: "Up to 80" },
        { label: "Processes (NPROC)", values: "Up to 500" },
        { label: "Dedicated I/O", values: "Up to 30 MB/s" },
        { label: "Mailboxes", values: perTier(plans, (p) => p.specs.email) },
        { label: "Email Sending", values: ["100/hour", "200/hour", "Unlimited", "Unlimited"] },
        { label: "Subdomains", values: "Unlimited" },
        { label: "MySQL Databases", values: "Unlimited" },
        { label: "FTP Accounts", values: "Unlimited" },
      ],
    },
    {
      title: "Performance & Software",
      rows: [
        { label: "LiteSpeed Web Server", values: CHECK },
        { label: "CloudLinux Isolation", values: CHECK },
        { label: "PHP Speed Boost", values: CHECK },
        { label: "AccelerateWP", values: CHECK },
        { label: "Free CDN Ready (Cloudflare)", values: CHECK },
        { label: "cPanel + Softaculous", values: CHECK },
        { label: "Managed WordPress", values: CHECK },
        { label: "Node.js, Python & Ruby", values: CHECK },
        { label: "Terminal (Jailed SSH)", values: CHECK },
      ],
    },
    {
      title: "Security & Backups",
      rows: [
        { label: "Free SSL Certificates", values: CHECK },
        { label: "Imunify360 + Malware Scanner", values: CHECK },
        { label: "ProActive Defense", values: CHECK },
        { label: "DDoS Protection", values: CHECK },
        { label: "Daily Backups (JetBackup)", values: CHECK },
        { label: "Free Migration", values: CHECK },
        { label: "Instant Activation", values: CHECK },
        { label: "Uptime Target", values: "99.9%" },
      ],
    },
  ];
}

/** Reseller, Master Reseller, and Alpha Reseller share the reseller platform set. */
export function resellerSpecGroups(
  plans: Plan[],
  options: { whmAccounts?: string[]; masterAccounts?: string[] } = {}
): SpecGroup[] {
  const accountRows: SpecRow[] = [
    { label: "cPanel Accounts", values: perTier(plans, (p) => p.specs.websites) },
  ];
  if (options.whmAccounts) {
    accountRows.push({ label: "WHM Reseller Accounts", values: options.whmAccounts });
  }
  if (options.masterAccounts) {
    accountRows.push({ label: "Master Reseller Accounts", values: options.masterAccounts });
  }

  return [
    {
      title: "Accounts & Resources",
      rows: [
        ...accountRows,
        { label: "NVMe SSD Storage", values: perTier(plans, (p) => p.specs.storage) },
        { label: "Bandwidth", values: "Unmetered" },
        { label: "Hosted Websites", values: "Unlimited" },
        { label: "Parked & Addon Domains", values: "Unlimited" },
        { label: "CPU per Account", values: "Up to 400%" },
        { label: "RAM per Account", values: "Up to 8 GB" },
        { label: "IOPS", values: "Up to 8,192" },
        { label: "Processes (NPROC)", values: "Up to 400" },
        { label: "Entry Processes", values: "Up to 80" },
        { label: "Mailboxes", values: "Unlimited" },
      ],
    },
    {
      title: "Reseller Business Tools",
      rows: [
        { label: "Free WHMCS Billing Software", values: CHECK },
        { label: "Full White-Label Branding", values: CHECK },
        { label: "Private Nameservers", values: CHECK },
        { label: "WHM Control Panel", values: CHECK },
        { label: "Custom Hosting Packages", values: CHECK },
        { label: "Overselling Support", values: CHECK },
      ],
    },
    {
      title: "Platform, Security & Backups",
      rows: [
        { label: "LiteSpeed Web Server", values: CHECK },
        { label: "CloudLinux Isolation", values: CHECK },
        { label: "cPanel + Softaculous", values: CHECK },
        { label: "Node.js, Python & Ruby", values: CHECK },
        { label: "Free SSL Certificates", values: CHECK },
        { label: "Imunify360 + DDoS Protection", values: CHECK },
        { label: "Daily Backups (JetBackup)", values: CHECK },
        { label: "Free Migration", values: CHECK },
        { label: "Instant Activation", values: CHECK },
        { label: "Uptime Target", values: "99.9%" },
      ],
    },
  ];
}
