import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { WpHero } from "@/components/wordpress/wp-hero";
import { WpFeatures } from "@/components/wordpress/wp-features";
import { Infrastructure } from "@/components/home/infrastructure";
import { HostingPlans } from "@/components/home/hosting-plans";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";
import { wordpressPlans } from "@/lib/plans";

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

      <Section id="pricing" className="bg-surface/30">
        <HostingPlans plans={wordpressPlans} />
      </Section>

      <Section className="py-14 sm:py-16">
        <WpFeatures />
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
