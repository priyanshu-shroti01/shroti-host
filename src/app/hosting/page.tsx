import type { Metadata } from "next";
import { sharedPlans } from "@/lib/plans";
import { hostingProductJsonLd } from "@/lib/seo";
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

const productJsonLd = hostingProductJsonLd({
  name: "Shared Hosting",
  description: "NVMe shared hosting with LiteSpeed, free SSL, daily backups, and free migration.",
  path: "/hosting",
  plans: sharedPlans,
});

export default function HostingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
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
