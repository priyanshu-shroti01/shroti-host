import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { WpHero } from "@/components/wordpress/wp-hero";
import { WpFeatures } from "@/components/wordpress/wp-features";
import { Infrastructure } from "@/components/home/infrastructure";
import { HostingPlans } from "@/components/home/hosting-plans";
import { FinalCta } from "@/components/home/final-cta";

export const metadata: Metadata = {
  title: "WordPress Hosting",
  description:
    "WordPress hosting tuned for speed — one-click install, LiteSpeed Cache, AccelerateWP, and free migration on every plan.",
  alternates: { canonical: "/wordpress-hosting" },
};

export default function WordPressHostingPage() {
  return (
    <>
      <Section className="pt-16 sm:pt-24">
        <WpHero />
      </Section>

      <Section className="bg-surface/30 py-14 sm:py-16">
        <WpFeatures />
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
