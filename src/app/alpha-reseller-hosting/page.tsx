import type { Metadata } from "next";
import { hostingProductJsonLd } from "@/lib/seo";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { Section } from "@/components/ui/section";
import { AlphaResellerHero } from "@/components/reseller/alpha-reseller-hero";
import { AlphaResellerBenefits } from "@/components/reseller/alpha-reseller-benefits";
import { Infrastructure } from "@/components/home/infrastructure";
import { HostingPlans } from "@/components/home/hosting-plans";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";
import { alphaResellerPlans } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Alpha Reseller Hosting",
  description:
    "The elite reseller tier — a three-level cPanel, WHM reseller, and Master Reseller hierarchy with the highest resource caps we offer.",
  alternates: { canonical: "/alpha-reseller-hosting" },
};

const productJsonLd = hostingProductJsonLd({
  name: "Alpha Reseller Hosting",
  description: "Alpha reseller hosting — the full three-level account hierarchy for the largest networks.",
  path: "/alpha-reseller-hosting",
  plans: alphaResellerPlans,
});

export default function AlphaResellerHostingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <Section backdrop={<HeroAtmosphere />} className="pt-10 sm:pt-20">
        <AlphaResellerHero />
      </Section>

      <Section id="pricing" className="bg-surface/30">
        <HostingPlans plans={alphaResellerPlans} />
      </Section>

      <Section className="py-14 sm:py-16">
        <AlphaResellerBenefits />
      </Section>

      <Section id="infrastructure" className="bg-surface/30">
        <Infrastructure />
      </Section>

      <Section id="faq">
        <Faq />
      </Section>

      <Section id="cta" className="bg-surface/30">
        <FinalCta />
      </Section>
    </>
  );
}
