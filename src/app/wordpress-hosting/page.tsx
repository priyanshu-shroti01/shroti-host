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
import { Faq, type FaqItem } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";
import { wordpressPlans } from "@/lib/plans";

// Real entry price from lib/plans.ts — never hard-coded in copy.
const fromPrice = Math.min(...wordpressPlans.map((p) => p.monthlyPrice));
const [bronze, gold, platinum, diamond] = wordpressPlans;

export const metadata: Metadata = {
  title: `Managed WordPress Hosting in India from ₹${fromPrice}/mo`,
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

/** WordPress-line questions, answered from lib/plans.ts and lib/plan-specs.ts. */
const wordpressFaqs: FaqItem[] = [
  {
    question: "How much does WordPress hosting cost?",
    answer: `${bronze.name} starts at ₹${bronze.monthlyPrice}/month for ${bronze.specs.websites.toLowerCase()} with ${bronze.specs.storage} storage. ${gold.name} (₹${gold.monthlyPrice}/mo) hosts ${gold.specs.websites.toLowerCase()}, ${platinum.name} (₹${platinum.monthlyPrice}/mo) ${platinum.specs.websites.toLowerCase()}, and ${diamond.name} (₹${diamond.monthlyPrice}/mo) ${diamond.specs.websites.toLowerCase()} on ${diamond.specs.storage.toLowerCase()} storage. The renewal price matches the signup price on every cycle.`,
  },
  {
    question: "Is WordPress pre-installed?",
    answer:
      "WordPress installs in one click from Softaculous in cPanel, and every plan ships with LiteSpeed Web Server, the LiteSpeed Cache plugin and AccelerateWP so server-level page caching works without extra configuration.",
  },
  {
    question: "Can I run a WooCommerce store on these plans?",
    answer:
      "Yes — WooCommerce is standard WordPress and runs on any tier. Pick the tier by how many sites and how much storage you need: Bronze for a single store on 10 GB, up to Diamond for unlimited sites on unmetered NVMe.",
  },
  {
    question: "What is the difference between WordPress Hosting and Shared Hosting?",
    answer:
      "Both run on the same NVMe + LiteSpeed + cPanel platform with the same tier sizes and entry price. The WordPress line comes with WordPress, LiteSpeed Cache and AccelerateWP set up for you; if you also run non-WordPress apps (Node.js, Python, custom PHP), Shared Hosting is the more general choice.",
  },
  {
    question: "Will you migrate my existing WordPress site?",
    answer:
      "Yes, free on every plan. Our team moves the files, database and email from your current host, and we tune the LiteSpeed cache before handing the site back to you.",
  },
];

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
        <Faq items={wordpressFaqs} />
      </Section>

      <Section id="cta" className="bg-surface/30">
        <FinalCta />
      </Section>
    </>
  );
}
