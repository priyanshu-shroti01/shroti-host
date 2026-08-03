import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { UnlimitedHero } from "@/components/unlimited/unlimited-hero";
import { Infrastructure } from "@/components/home/infrastructure";
import { HostingPlans } from "@/components/home/hosting-plans";
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

      <Section id="infrastructure" className="bg-surface/30">
        <Infrastructure />
      </Section>

      <Section>
        <HostingPlans plans={unlimitedPlans} />
      </Section>

      <Section id="cta" className="bg-surface/30">
        <FinalCta />
      </Section>
    </>
  );
}
