import type { Metadata } from "next";
import { PlanSpecTable } from "@/components/hosting/plan-spec-table";
import { resellerSpecGroups } from "@/lib/plan-specs";
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
  title: "Alpha Reseller Hosting (Coming Soon)",
  description:
    "The elite reseller tier — a three-level cPanel, WHM reseller, and Master Reseller hierarchy with the highest resource caps we offer.",
  alternates: { canonical: "/alpha-reseller-hosting" },
};


export default function AlphaResellerHostingPage() {
  return (
    <>
      <Section backdrop={<HeroAtmosphere />} className="pt-10 sm:pt-20">
        <AlphaResellerHero />
      </Section>

      <Section id="pricing" className="bg-surface/30">
        <HostingPlans plans={alphaResellerPlans} comingSoon lineName="Alpha Reseller Hosting" />
      </Section>

      <Section id="specs">
        <PlanSpecTable plans={alphaResellerPlans} groups={resellerSpecGroups(alphaResellerPlans, { whmAccounts: ["10", "100", "150", "Unlimited"], masterAccounts: ["10", "100", "150", "Unlimited"] })} />
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
