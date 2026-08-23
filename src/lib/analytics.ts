/**
 * GA4 helpers (property G-TGFE8BKY0X, shared with portal.shrotihost.in).
 *
 * gtag.js itself is loaded once in `src/app/layout.tsx` with cross-domain
 * linking to the WHMCS portal so a visitor's session survives the hand-off to
 * checkout. Every helper here is a no-op on the server and when gtag has not
 * loaded (ad blockers, consent tools), so callers never need to guard.
 *
 * Plain module — imported by server and client components alike. Keep it free
 * of "use client".
 */
export const GA_MEASUREMENT_ID = "G-TGFE8BKY0X";
export const GA_LINKER_DOMAINS = ["shrotihost.in", "portal.shrotihost.in"] as const;

type GtagParams = Record<string, string | number | boolean | undefined>;
type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}

export function trackEvent(name: string, params: GtagParams = {}): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  try {
    window.gtag("event", name, params);
  } catch {
    /* analytics must never break the page */
  }
}

/** Fired when a shopper clicks "Choose" on a plan card, right before the portal hand-off. */
export function trackSelectPlan(plan: {
  line: string;
  plan: string;
  cycle: string;
  priceInr?: number;
}): void {
  trackEvent("select_plan", {
    hosting_line: plan.line,
    plan_name: plan.plan,
    billing_cycle: plan.cycle,
    value: plan.priceInr,
    currency: plan.priceInr === undefined ? undefined : "INR",
  });
}

/** Appends campaign parameters so WHMCS/GA can attribute the order to the site. */
export function withUtm(url: string, content?: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", "shrotihost.in");
    u.searchParams.set("utm_medium", "site");
    if (content) u.searchParams.set("utm_content", content);
    return u.toString();
  } catch {
    return url;
  }
}
