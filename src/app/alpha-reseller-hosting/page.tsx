import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { AlphaResellerHero } from "@/components/reseller/alpha-reseller-hero";
import { AlphaResellerBenefits } from "@/components/reseller/alpha-reseller-benefits";
import { Infrastructure } from "@/components/home/infrastructure";
import { HostingPlans } from "@/components/home/hosting-plans";
import { FinalCta } from "@/components/home/final-cta";
import { alphaResellerPlans } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Alpha Reseller Hosting",
  description:
    "The elite reseller tier — a three-level cPanel, WHM reseller, and Master Reseller hierarchy with the highest resource caps we offer.",
  alternates: { canonical: "/alpha-reseller-hosting" },
};

export default function AlphaResellerHostingPage() {
  return (
    <>
      <Section className="pt-16 sm:pt-24">
        <AlphaResellerHero />
      </Section>

      <Section className="bg-surface/30 py-14 sm:py-16">
        <AlphaResellerBenefits />
      </Section>

      <Section id="infrastructure">
        <Infrastructure />
      </Section>

      <Section className="bg-surface/30">
        <HostingPlans plans={alphaResellerPlans} />
      </Section>

      <Section id="cta">
        <FinalCta />
      </Section>
    </>
  );
}
