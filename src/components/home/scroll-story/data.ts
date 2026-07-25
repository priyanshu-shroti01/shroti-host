export const DEFAULT_STORY_DOMAIN = "yourbrand.com";

export const chapters = [
  { id: "domain", kicker: "Chapter 01", title: "Claim your identity" },
  { id: "dns", kicker: "Chapter 02", title: "Point it anywhere" },
  { id: "deploy", kicker: "Chapter 03", title: "Go live in seconds" },
  { id: "dashboard", kicker: "Chapter 04", title: "Your command center" },
  { id: "analytics", kicker: "Chapter 05", title: "Watch it grow" },
  { id: "scaling", kicker: "Chapter 06", title: "Built to scale" },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];

/** Real query ideas, same generator as the /domains page — not availability claims. */
export function storySuggestions(base: string): string[] {
  const clean = base.trim().toLowerCase().replace(/[^a-z0-9]/g, "") || "yourbrand";
  return [`${clean}.com`, `${clean}.in`, `get${clean}.com`, `${clean}.app`];
}

export function dnsRecordsFor(domain: string) {
  return [
    { type: "A", name: "@", value: "192.0.2.10" },
    { type: "CNAME", name: "www", value: domain },
    { type: "MX", name: "@", value: `mail.${domain}` },
  ];
}

/** Illustrative sample traffic — not a real customer's analytics. */
export const sampleTraffic = [24, 31, 28, 40, 38, 52, 49, 64, 60, 74, 71, 88];

export const deploySteps = [
  { label: "Provisioning hosting", detail: "LiteSpeed · NVMe" },
  { label: "Installing SSL", detail: "Let's Encrypt" },
  { label: "Website live", detail: "Global CDN active" },
];

export const scalingTiers = [
  { plan: "Launch", sites: 1, storage: 10 },
  { plan: "Grow", sites: 10, storage: 50 },
  { plan: "Scale", sites: "Unlimited" as const, storage: 150 },
];
