export const DEFAULT_STORY_DOMAIN = "yourbrand.com";

/** Real provisioning order: server before DNS (you need an IP before you can point anything at it). */
export const chapters = [
  { id: "domain", kicker: "Chapter 01", title: "Search Domain" },
  { id: "server", kicker: "Chapter 02", title: "Launch Server" },
  { id: "dns", kicker: "Chapter 03", title: "Configure DNS" },
  { id: "ssl", kicker: "Chapter 04", title: "Install SSL" },
  { id: "dashboard", kicker: "Chapter 05", title: "Dashboard" },
  { id: "monitor", kicker: "Chapter 06", title: "Monitor Website" },
  { id: "scale", kicker: "Chapter 07", title: "Scale Resources" },
  { id: "success", kicker: "Chapter 08", title: "Success" },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];

/** Real query ideas, same generator as the /domains page — not availability claims. */
export function storySuggestions(base: string): string[] {
  const clean = base.trim().toLowerCase().replace(/[^a-z0-9]/g, "") || "yourbrand";
  return [`${clean}.com`, `${clean}.in`, `get${clean}.com`, `${clean}.app`];
}

export const SERVER_IP = "192.0.2.10";

export function dnsRecordsFor(domain: string) {
  return [
    { type: "A", name: "@", value: SERVER_IP },
    { type: "CNAME", name: "www", value: domain },
    { type: "MX", name: "@", value: `mail.${domain}` },
  ];
}

/** Subset of the real "on every plan" feature list — SSL gets its own chapter, so it's excluded here. */
export const serverSpecs = ["LiteSpeed Web Server", "NVMe Storage", "Daily Backups", "CloudLinux"];

export const sslAuthority = "Let's Encrypt";

/** Illustrative sample traffic — not a real customer's analytics. */
export const sampleTraffic = [24, 31, 28, 40, 38, 52, 49, 64, 60, 74, 71, 88];

export const scalingTiers = [
  { plan: "Launch", sites: 1, storage: 10 },
  { plan: "Grow", sites: 10, storage: 50 },
  { plan: "Scale", sites: "Unlimited" as const, storage: 150 },
];

/** Journey recap shown on the Success chapter. */
export const journeySteps = ["Domain", "Server", "DNS", "SSL"];
