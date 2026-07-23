import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { HostingHero } from "@/components/hosting/hosting-hero";
import { HostingConfigurator } from "@/components/hosting/hosting-configurator";
import { Infrastructure } from "@/components/home/infrastructure";
import { HostingPlans } from "@/components/home/hosting-plans";
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
      <Section className="pt-16 sm:pt-24">
        <HostingHero />
      </Section>

      <Section id="configure" className="bg-surface/30">
        <HostingConfigurator />
      </Section>

      <Section id="infrastructure">
        <Infrastructure />
      </Section>

      <Section className="bg-surface/30">
        <HostingPlans />
      </Section>

      <Section id="cta">
        <FinalCta />
      </Section>
    </>
  );
}
