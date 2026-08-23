import { NextRequest } from "next/server";
import { getDomainPricing } from "@/lib/domain-pricing.server";
import { sanitizeDomainInput } from "@/lib/domain-input";
import { apiError, clientIp, jsonNoStore, rateLimit, type RateLimitMap } from "@/lib/api-utils";

/**
 * Live domain availability + pricing check.
 *
 * Availability is determined via RDAP (rdap.org's bootstrap redirector) —
 * the standard, free, no-API-key protocol registries expose for exactly
 * this purpose. It is best-effort: some ccTLDs don't run public RDAP
 * servers, in which case we report `available: null` (unknown) rather than
 * guessing. Pricing is only attached when the TLD is one we actually sell
 * (sourced from the pricing catalog that powers /domains) — never
 * fabricated for TLDs we don't carry.
 *
 * Abuse controls: input is sanitised/validated (src/lib/domain-input.ts),
 * callers are limited to 30 requests/min/IP, and RDAP answers are cached
 * in-process for 60 s so a burst of identical lookups costs one fetch.
 */

export const dynamic = "force-dynamic";

type CheckResult = {
  domain: string;
  tld: string;
  available: boolean | null;
  priceInr: number | null;
};

const RDAP_TIMEOUT_MS = 3500;
const EXACT_TLDS = [".com", ".in", ".org", ".net", ".co", ".io", ".app", ".xyz"];
const SUGGESTION_PREFIXES = ["get", "try", "my", "join"];
const SUGGESTION_SUFFIXES = ["hq", "hub", "app", "now"];
const MAX_SUGGESTIONS = 6;
const MAX_QUERY_CHARS = 512;

const hits: RateLimitMap = new Map();
const RATE = { limit: 30, windowMs: 60 * 1000 };

const RDAP_CACHE_MS = 60 * 1000;
const RDAP_CACHE_MAX = 5000;
const rdapCache = new Map<string, { at: number; available: boolean | null }>();

async function checkAvailability(domain: string): Promise<boolean | null> {
  const now = Date.now();
  const cached = rdapCache.get(domain);
  if (cached && now - cached.at < RDAP_CACHE_MS) return cached.available;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), RDAP_TIMEOUT_MS);
  let available: boolean | null = null;
  try {
    const res = await fetch(`https://rdap.org/domain/${domain}`, {
      signal: controller.signal,
      redirect: "follow",
      headers: { Accept: "application/rdap+json" },
    });
    if (res.status === 404) available = true;
    else if (res.ok) available = false;
  } catch {
    available = null;
  } finally {
    clearTimeout(timer);
  }

  if (rdapCache.size >= RDAP_CACHE_MAX) {
    for (const [k, v] of rdapCache) if (now - v.at >= RDAP_CACHE_MS) rdapCache.delete(k);
    if (rdapCache.size >= RDAP_CACHE_MAX) rdapCache.clear();
  }
  rdapCache.set(domain, { at: now, available });
  return available;
}

function buildSuggestionBases(base: string): string[] {
  const variants = new Set<string>();
  for (const p of SUGGESTION_PREFIXES) variants.add(p + base);
  for (const s of SUGGESTION_SUFFIXES) variants.add(base + s);
  return Array.from(variants).slice(0, MAX_SUGGESTIONS);
}

export async function GET(request: NextRequest) {
  if (!rateLimit(hits, clientIp(request), RATE)) {
    return apiError(429, "rate_limited", "Too many lookups — please slow down.");
  }

  const q = (request.nextUrl.searchParams.get("q") ?? "").slice(0, MAX_QUERY_CHARS);
  const { domains } = await getDomainPricing();
  const priceByTld = new Map(domains.map((d) => [d.tld, d.registerInr] as const));

  const input = sanitizeDomainInput(q, Array.from(priceByTld.keys()));
  if (!input.ok) {
    if (input.reason === "empty") return jsonNoStore({ query: q, exact: [], suggestions: [] });
    if (input.reason === "unsupported_characters") {
      return jsonNoStore({ query: q, exact: [], suggestions: [], error: "unsupported_characters" });
    }
    return apiError(
      400,
      "invalid_domain",
      "Use letters, digits and hyphens only (no leading or trailing hyphen).",
    );
  }
  const { base, tld: explicitTld } = input;

  const checkOne = async (b: string, tld: string): Promise<CheckResult> => {
    const domain = `${b}${tld}`;
    const available = await checkAvailability(domain);
    return { domain, tld, available, priceInr: priceByTld.get(tld) ?? null };
  };

  const exactTlds = explicitTld ? [explicitTld] : EXACT_TLDS;
  const exactPromise = Promise.all(exactTlds.map((tld) => checkOne(base, tld)));

  const suggestionTld = explicitTld ?? ".com";
  const suggestionsPromise = Promise.all(
    buildSuggestionBases(base).map((b) => checkOne(b, suggestionTld)),
  );

  const [exact, suggestions] = await Promise.all([exactPromise, suggestionsPromise]);
  return jsonNoStore({ query: q, exact, suggestions });
}
