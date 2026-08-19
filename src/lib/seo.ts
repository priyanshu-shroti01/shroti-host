import type { Plan } from "@/lib/plans";
import type { Service } from "@/lib/services";

const SITE_URL = "https://shrotihost.in";

/**
 * Service structured data for a BUILD page. No aggregateRating, no invented
 * priceRange — offers are deliberately absent until real rate cards exist
 * (same fabrication rule as hostingProductJsonLd).
 */
export function serviceJsonLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.metaDescription,
    url: `${SITE_URL}/${service.slug}`,
    serviceType: service.name,
    areaServed: "IN",
    provider: {
      "@type": "Organization",
      name: "ShrotiHost",
      url: SITE_URL,
    },
  };
}

/** BreadcrumbList for any page: pass the trail in order, ending at the page itself. */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  };
}

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
