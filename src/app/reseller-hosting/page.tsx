import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { ResellerHero } from "@/components/reseller/reseller-hero";
import { ResellerBenefits } from "@/components/reseller/reseller-benefits";
import { Infrastructure } from "@/components/home/infrastructure";
import { HostingPlans } from "@/components/home/hosting-plans";
import { FinalCta } from "@/components/home/final-cta";
import { resellerPlans } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Reseller Hosting",
  description:
    "Start your own hosting business — full WHM access, white-label branding, and free WHMCS billing software on every plan.",
  alternates: { canonical: "/reseller-hosting" },
};

export default function ResellerHostingPage() {
  return (
    <>
      <Section className="pt-16 sm:pt-24">
        <ResellerHero />
      </Section>

      <Section className="bg-surface/30 py-14 sm:py-16">
        <ResellerBenefits />
      </Section>

      <Section id="infrastructure">
        <Infrastructure />
      </Section>

      <Section className="bg-surface/30">
        <HostingPlans plans={resellerPlans} />
      </Section>

      <Section id="cta">
        <FinalCta />
      </Section>
    </>
  );
}
