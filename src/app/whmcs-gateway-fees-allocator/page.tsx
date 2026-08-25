import type { Metadata } from "next";
import { breadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import { PRODUCT_NAME, faq, pricing, STORE_URL } from "@/lib/gateway-fees-module";
import { GatewayHero } from "@/components/gateway-module/hero";
import { ContextEngine } from "@/components/gateway-module/context-engine";
import { FeeDemo } from "@/components/gateway-module/fee-demo";
import { Allocator } from "@/components/gateway-module/allocator";
import { RuleBuilder } from "@/components/gateway-module/rule-builder";
import { Architecture } from "@/components/gateway-module/architecture";
import { CustomerView } from "@/components/gateway-module/customer-view";
import { Trust } from "@/components/gateway-module/trust";
import { FaqAndCta } from "@/components/gateway-module/faq-cta";

export const metadata: Metadata = {
  title: "WHMCS Gateway Fees & Allocator Module",
  description:
    "Charge or discount by payment gateway in WHMCS, and control which methods appear at checkout — by country, currency, client group, billing cycle and order value.",
  alternates: { canonical: "/whmcs-gateway-fees-allocator" },
  openGraph: {
    title: "WHMCS Gateway Fees & Allocator Module",
    description:
      "Charge or discount by payment gateway in WHMCS, and control which methods appear at checkout.",
    url: `${SITE_URL}/whmcs-gateway-fees-allocator`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WHMCS Gateway Fees & Allocator Module",
    description:
      "Charge or discount by payment gateway in WHMCS, and control which methods appear at checkout.",
  },
};

/**
 * Product schema carries the real WHMCS catalogue prices, one offer per
 * currency the store is configured for — not a converted rupee figure. The FAQ
 * schema mirrors copy that is genuinely in the DOM (the accordion keeps every
 * answer mounted), so nothing here describes text a visitor cannot find.
 */
const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: PRODUCT_NAME,
  description:
    "A WHMCS addon module that applies per-gateway charges or discounts to invoices and controls which payment methods are offered, using invoice context, rule priority and line-item allocation.",
  brand: { "@type": "Brand", name: "ShrotiHost" },
  category: "WHMCS Addon Module",
  url: `${SITE_URL}/whmcs-gateway-fees-allocator`,
  offers: pricing.flatMap((tier) =>
    (Object.keys(tier.amounts) as (keyof typeof tier.amounts)[]).map((currency) => ({
      "@type": "Offer",
      name: `${tier.label} licence`,
      price: tier.amounts[currency].toFixed(2),
      priceCurrency: currency,
      url: STORE_URL,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "ShrotiHost" },
    })),
  ),
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Gateway Fees & Allocator", path: "/whmcs-gateway-fees-allocator" },
            ]),
          ),
        }}
      />
      <GatewayHero />
      <ContextEngine />
      <FeeDemo />
      <Allocator />
      <RuleBuilder />
      <Architecture />
      <CustomerView />
      <Trust />
      <FaqAndCta />
    </>
  );
}
