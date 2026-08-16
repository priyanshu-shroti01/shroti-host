import "server-only";
import { readFile } from "node:fs/promises";
import { allDomains, type DomainPrice } from "@/lib/domains";

/**
 * Live TLD pricing, exported daily from WHMCS (GetTLDPricing) by
 * /home/shrotihost/whmcs-tools/export-tld-pricing.php into a JSON file.
 * Pages that render pricing use ISR (`revalidate = 86400`) so the file is
 * re-read at most once a day; the static `allDomains` list is the fallback
 * whenever the file is missing or malformed (fresh checkout, dev machine).
 */
const PRICING_FILE =
  process.env.TLD_PRICING_FILE ?? "/home/shrotihost/shared-data/tld-pricing.json";

type PricingFile = { updatedAt: string; domains: DomainPrice[] };

let cache: { at: number; data: DomainPrice[]; updatedAt: string | null } | null = null;
const CACHE_MS = 60 * 60 * 1000; // in-process cache; the file only changes daily

export async function getDomainPricing(): Promise<{ domains: DomainPrice[]; updatedAt: string | null }> {
  if (cache && Date.now() - cache.at < CACHE_MS) return { domains: cache.data, updatedAt: cache.updatedAt };
  try {
    const raw = await readFile(PRICING_FILE, "utf8");
    const parsed = JSON.parse(raw) as PricingFile;
    if (!Array.isArray(parsed.domains) || parsed.domains.length < 5) throw new Error("too few TLDs");
    cache = { at: Date.now(), data: parsed.domains, updatedAt: parsed.updatedAt ?? null };
  } catch {
    cache = { at: Date.now(), data: allDomains, updatedAt: null };
  }
  return { domains: cache.data, updatedAt: cache.updatedAt };
}
