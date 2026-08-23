import type { BlogPost } from "@/lib/blog";
import type { Plan } from "@/lib/plans";
import type { Service } from "@/lib/services";

export const SITE_URL = "https://shrotihost.in";
const OG_IMAGE = `${SITE_URL}/opengraph-image`;

/**
 * Organization entity — emitted once from the root layout. Every field here
 * is verifiable on the site itself; legal entity name, registered address and
 * GSTIN are deliberately absent until the owner supplies them.
 */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ShrotiHost",
  url: SITE_URL,
  description:
    "ShrotiHost is an Indian web hosting and development company offering NVMe shared, WordPress, unlimited and reseller hosting from ₹39/month, domain registration, and custom website and app builds.",
  logo: `${SITE_URL}/icon.png`,
  foundingDate: "2023-04-13",
  areaServed: "IN",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "support@shrotihost.in",
    telephone: "+91-9582129099",
    availableLanguage: ["en", "hi"],
  },
  sameAs: ["https://www.trustpilot.com/review/shrotihost.in"],
};

/** WebSite entity — no SearchAction: the site has no search endpoint. */
export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ShrotiHost",
  url: SITE_URL,
};

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

/** Article structured data for a blog post — author/publisher are the company, not a named person. */
export function articleJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: OG_IMAGE,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { "@type": "Organization", name: "ShrotiHost", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "ShrotiHost",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` },
    },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
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
    image: OG_IMAGE,
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
