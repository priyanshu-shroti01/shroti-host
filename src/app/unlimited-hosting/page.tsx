import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { UnlimitedHero } from "@/components/unlimited/unlimited-hero";
import { Infrastructure } from "@/components/home/infrastructure";
import { HostingPlans } from "@/components/home/hosting-plans";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";
import { unlimitedPlans } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Unlimited Hosting",
  description:
    "Host unlimited websites on one plan — built for agencies, developers, and anyone managing multiple client sites. Same price, no per-site add-ons.",
  alternates: { canonical: "/unlimited-hosting" },
};

export default function UnlimitedHostingPage() {
  return (
    <>
      <Section className="pt-16 sm:pt-24">
        <UnlimitedHero />
      </Section>

      <Section id="pricing" className="bg-surface/30">
        <HostingPlans plans={unlimitedPlans} />
      </Section>

      <Section id="infrastructure">
        <Infrastructure />
      </Section>

      <Section id="faq" className="bg-surface/30">
        <Faq />
      </Section>

      <Section id="cta">
        <FinalCta />
      </Section>
    </>
  );
}
