import type { Metadata } from "next";
import { hostingProductJsonLd } from "@/lib/seo";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { Section } from "@/components/ui/section";
import { ResellerHero } from "@/components/reseller/reseller-hero";
import { ResellerBenefits } from "@/components/reseller/reseller-benefits";
import { Infrastructure } from "@/components/home/infrastructure";
import { HostingPlans } from "@/components/home/hosting-plans";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";
import { resellerPlans } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Reseller Hosting",
  description:
    "Start your own hosting business — full WHM access, white-label branding, and free WHMCS billing software on every plan.",
  alternates: { canonical: "/reseller-hosting" },
};

const productJsonLd = hostingProductJsonLd({
  name: "Reseller Hosting",
  description: "White-label reseller hosting with WHM, free WHMCS billing, and JetBackup.",
  path: "/reseller-hosting",
  plans: resellerPlans,
});

export default function ResellerHostingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <Section backdrop={<HeroAtmosphere />} className="pt-10 sm:pt-20">
        <ResellerHero />
      </Section>

      <Section id="pricing" className="bg-surface/30">
        <HostingPlans plans={resellerPlans} />
      </Section>

      <Section className="py-14 sm:py-16">
        <ResellerBenefits />
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
