import type { Plan } from "@/lib/plans";

const SITE_URL = "https://shrotihost.in";

/**
 * Product + Offer structured data for a hosting line — real prices from
 * lib/plans.ts only, INR, no invented ratings or review counts (schema
 * with fabricated aggregateRating is a Google penalty risk, not a boost).
 */
export function hostingProductJsonLd({
  name,
  description,
  path,
  plans,
}: {
  name: string;
  description: string;
  path: string;
  plans: Plan[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url: `${SITE_URL}${path}`,
    brand: { "@type": "Brand", name: "ShrotiHost" },
    offers: plans.map((plan) => ({
      "@type": "Offer",
      name: `${name} — ${plan.name}`,
      price: plan.monthlyPrice,
      priceCurrency: "INR",
      url: `${SITE_URL}${path}#compare`,
      availability: "https://schema.org/InStock",
    })),
  };
}
