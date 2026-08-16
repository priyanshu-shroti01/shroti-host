import { NextRequest } from "next/server";
import { getDomainPricing } from "@/lib/domain-pricing.server";

/**
 * Live domain availability + pricing check.
 *
 * Availability is determined via RDAP (rdap.org's bootstrap redirector) —
 * the standard, free, no-API-key protocol registries expose for exactly
 * this purpose. It is best-effort: some ccTLDs don't run public RDAP
 * servers, in which case we report `available: null` (unknown) rather than
 * guessing. Pricing is only attached when the TLD is one we actually sell
 * (sourced from allDomains, the same catalog that powers /domains) — never
 * fabricated for TLDs we don't carry.
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

function sanitizeInput(raw: string): { base: string; explicitTld: string | null } {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/[^a-z0-9.-]/g, "");
  const firstDot = cleaned.indexOf(".");
  if (firstDot === -1) return { base: cleaned, explicitTld: null };
  return { base: cleaned.slice(0, firstDot), explicitTld: cleaned.slice(firstDot) };
}

async function priceFor(tld: string): Promise<number | null> {
  const { domains } = await getDomainPricing();
  return domains.find((d) => d.tld === tld)?.registerInr ?? null;
}

async function checkAvailability(domain: string): Promise<boolean | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), RDAP_TIMEOUT_MS);
  try {
    const res = await fetch(`https://rdap.org/domain/${domain}`, {
      signal: controller.signal,
      redirect: "follow",
      headers: { Accept: "application/rdap+json" },
    });
    if (res.status === 404) return true;
    if (res.ok) return false;
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function checkOne(base: string, tld: string): Promise<CheckResult> {
  const domain = `${base}${tld}`;
  const available = await checkAvailability(domain);
  return { domain, tld, available, priceInr: await priceFor(tld) };
}

function buildSuggestionBases(base: string): string[] {
  const variants = new Set<string>();
  for (const p of SUGGESTION_PREFIXES) variants.add(p + base);
  for (const s of SUGGESTION_SUFFIXES) variants.add(base + s);
  return Array.from(variants).slice(0, MAX_SUGGESTIONS);
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const { base, explicitTld } = sanitizeInput(q);

  if (!base) {
    return Response.json({ query: q, exact: [], suggestions: [] });
  }

  const exactTlds = explicitTld ? [explicitTld] : EXACT_TLDS;
  const exactPromise = Promise.all(exactTlds.map((tld) => checkOne(base, tld)));

  const suggestionBases = buildSuggestionBases(base);
  const suggestionTld = explicitTld ?? ".com";
  const suggestionsPromise = Promise.all(
    suggestionBases.map((suggestedBase) => checkOne(suggestedBase, suggestionTld)),
  );

  const [exact, suggestions] = await Promise.all([exactPromise, suggestionsPromise]);

  return Response.json({ query: q, exact, suggestions });
}
