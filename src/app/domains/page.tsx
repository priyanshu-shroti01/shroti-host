import type { Metadata } from "next";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { Section } from "@/components/ui/section";
import { DomainsHero } from "@/components/domains/domains-hero";
import { TrustedTech } from "@/components/home/trusted-tech";
import { ExtensionGrid } from "@/components/domains/extension-grid";
import { DomainBenefits } from "@/components/domains/domain-benefits";
import { FinalCta } from "@/components/home/final-cta";

export const metadata: Metadata = {
  title: "Domain Search & Registration",
  description:
    "Search and register your domain with ShrotiHost. Real pricing shown upfront, including renewals — no hidden fees.",
  alternates: { canonical: "/domains" },
};

export default function DomainsPage() {
  return (
    <>
      <Section backdrop={<HeroAtmosphere />} className="pt-10 sm:pt-20" containerClassName="max-w-5xl">
        <DomainsHero />
      </Section>

      <TrustedTech />

      <Section className="bg-surface/30">
        <ExtensionGrid />
      </Section>

      <Section className="py-14 sm:py-16">
        <DomainBenefits />
      </Section>

      <Section id="cta">
        <FinalCta />
      </Section>
    </>
  );
}
