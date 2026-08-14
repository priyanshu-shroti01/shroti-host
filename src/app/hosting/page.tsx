import type { Metadata } from "next";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { Section } from "@/components/ui/section";
import { HostingHero } from "@/components/hosting/hosting-hero";
import { HostingConfigurator } from "@/components/hosting/hosting-configurator";
import { Infrastructure } from "@/components/home/infrastructure";
import { HostingPlans } from "@/components/home/hosting-plans";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";

export const metadata: Metadata = {
  title: "Shared Hosting",
  description:
    "Configure your hosting — storage, traffic, PHP version, and email — matched live to the right plan. LiteSpeed, NVMe, and free migration on every plan.",
  alternates: { canonical: "/hosting" },
};

export default function HostingPage() {
  return (
    <>
      <Section backdrop={<HeroAtmosphere />} className="pt-10 sm:pt-20">
        <HostingHero />
      </Section>

      {/* Pricing directly under the hero, matching RankHostZone's product-page order. */}
      <Section id="pricing" className="bg-surface/30">
        <HostingPlans />
      </Section>

      <Section id="configure">
        <HostingConfigurator />
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
