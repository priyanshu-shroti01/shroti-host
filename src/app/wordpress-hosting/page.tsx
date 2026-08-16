import type { Metadata } from "next";
import { PlanSpecTable } from "@/components/hosting/plan-spec-table";
import { hostingSpecGroups } from "@/lib/plan-specs";
import { hostingProductJsonLd } from "@/lib/seo";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { Section } from "@/components/ui/section";
import { WpHero } from "@/components/wordpress/wp-hero";
import { WpFeatures } from "@/components/wordpress/wp-features";
import { Infrastructure } from "@/components/home/infrastructure";
import { HostingPlans } from "@/components/home/hosting-plans";
import { storeGroups } from "@/lib/whmcs";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";
import { wordpressPlans } from "@/lib/plans";

export const metadata: Metadata = {
  title: "WordPress Hosting",
  description:
    "WordPress hosting tuned for speed — one-click install, LiteSpeed Cache, AccelerateWP, and free migration on every plan.",
  alternates: { canonical: "/wordpress-hosting" },
};

const productJsonLd = hostingProductJsonLd({
  name: "WordPress Hosting",
  description: "Managed WordPress hosting with LiteSpeed Cache, one-click installs, and free migration.",
  path: "/wordpress-hosting",
  plans: wordpressPlans,
});

export default function WordPressHostingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <Section backdrop={<HeroAtmosphere />} className="pt-10 sm:pt-20">
        <WpHero />
      </Section>

      <Section id="pricing" className="bg-surface/30">
        <HostingPlans plans={wordpressPlans} orderUrl={storeGroups.wordpress} />
      </Section>

      <Section id="specs">
        <PlanSpecTable plans={wordpressPlans} groups={hostingSpecGroups(wordpressPlans)} />
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
