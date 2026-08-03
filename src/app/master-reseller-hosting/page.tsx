import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { MasterResellerHero } from "@/components/reseller/master-reseller-hero";
import { MasterResellerBenefits } from "@/components/reseller/master-reseller-benefits";
import { Infrastructure } from "@/components/home/infrastructure";
import { HostingPlans } from "@/components/home/hosting-plans";
import { FinalCta } from "@/components/home/final-cta";
import { masterResellerPlans } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Master Reseller Hosting",
  description:
    "Create your own reseller network — WHM reseller accounts, white-label branding, and free WHMCS billing software on every plan.",
  alternates: { canonical: "/master-reseller-hosting" },
};

export default function MasterResellerHostingPage() {
  return (
    <>
      <Section className="pt-16 sm:pt-24">
        <MasterResellerHero />
      </Section>

      <Section className="bg-surface/30 py-14 sm:py-16">
        <MasterResellerBenefits />
      </Section>

      <Section id="infrastructure">
        <Infrastructure />
      </Section>

      <Section className="bg-surface/30">
        <HostingPlans plans={masterResellerPlans} />
      </Section>

      <Section id="cta">
        <FinalCta />
      </Section>
    </>
  );
}
