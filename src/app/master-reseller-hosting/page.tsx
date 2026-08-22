import type { Metadata } from "next";
import { PlanSpecTable } from "@/components/hosting/plan-spec-table";
import { resellerSpecGroups } from "@/lib/plan-specs";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { Section } from "@/components/ui/section";
import { MasterResellerHero } from "@/components/reseller/master-reseller-hero";
import { MasterResellerBenefits } from "@/components/reseller/master-reseller-benefits";
import { Infrastructure } from "@/components/home/infrastructure";
import { HostingPlans } from "@/components/home/hosting-plans";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";
import { masterResellerPlans } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Master Reseller Hosting (Coming Soon)",
  description:
    "Create your own reseller network — WHM reseller accounts, white-label branding, and free WHMCS billing software on every plan.",
  alternates: { canonical: "/master-reseller-hosting" },
};


export default function MasterResellerHostingPage() {
  return (
    <>
      <Section backdrop={<HeroAtmosphere />} className="pt-10 sm:pt-20">
        <MasterResellerHero />
      </Section>

      <Section id="pricing" className="bg-surface/30">
        <HostingPlans plans={masterResellerPlans} comingSoon lineName="Master Reseller Hosting" />
      </Section>

      <Section id="specs">
        <PlanSpecTable plans={masterResellerPlans} groups={resellerSpecGroups(masterResellerPlans, { whmAccounts: ["10", "100", "150", "Unlimited"] })} />
      </Section>

      <Section className="py-14 sm:py-16">
        <MasterResellerBenefits />
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
