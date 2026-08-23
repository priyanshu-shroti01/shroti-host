import type { Metadata } from "next";
import { PlanSpecTable } from "@/components/hosting/plan-spec-table";
import { hostingSpecGroups } from "@/lib/plan-specs";
import { sharedPlans } from "@/lib/plans";
import { hostingProductJsonLd } from "@/lib/seo";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { Section } from "@/components/ui/section";
import { HostingHero } from "@/components/hosting/hosting-hero";
import { Infrastructure } from "@/components/home/infrastructure";
import { HostingPlans } from "@/components/home/hosting-plans";
import { Faq, type FaqItem } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";

// Real entry price from lib/plans.ts — never hard-coded in copy.
const fromPrice = Math.min(...sharedPlans.map((p) => p.monthlyPrice));
const [bronze, gold, platinum, diamond] = sharedPlans;

export const metadata: Metadata = {
  title: `NVMe Shared Hosting in India from ₹${fromPrice}/mo`,
  description:
    "Shared hosting on LiteSpeed and NVMe — Bronze to Diamond plans with free SSL, free migration, daily backups and the same renewal price every cycle.",
  alternates: { canonical: "/hosting" },
};

const productJsonLd = hostingProductJsonLd({
  name: "Shared Hosting",
  description: "NVMe shared hosting with LiteSpeed, free SSL, daily backups, and free migration.",
  path: "/hosting",
  plans: sharedPlans,
});

/** Shared-hosting questions, answered from lib/plans.ts and lib/plan-specs.ts. */
const hostingFaqs: FaqItem[] = [
  {
    question: "How much does shared hosting cost?",
    answer: `${bronze.name} starts at ₹${bronze.monthlyPrice}/month for ${bronze.specs.websites.toLowerCase()} with ${bronze.specs.storage} storage. ${gold.name} (₹${gold.monthlyPrice}/mo) covers ${gold.specs.websites.toLowerCase()} and ${gold.specs.storage}, ${platinum.name} (₹${platinum.monthlyPrice}/mo) ${platinum.specs.websites.toLowerCase()} and ${platinum.specs.storage}, and ${diamond.name} (₹${diamond.monthlyPrice}/mo) gives you ${diamond.specs.websites.toLowerCase()} on ${diamond.specs.storage.toLowerCase()} storage. Renewals cost the same as the first term on every cycle.`,
  },
  {
    question: "Is LiteSpeed included on every plan?",
    answer:
      "Yes. LiteSpeed Web Server, CloudLinux account isolation, free SSL certificates, Imunify360 malware protection and daily JetBackup backups are standard on every shared tier, including Bronze.",
  },
  {
    question: "Can I run Node.js or Python apps on shared hosting?",
    answer:
      "Yes. Every plan supports Node.js, Python and Ruby alongside PHP, with a jailed SSH terminal, unlimited MySQL databases and Softaculous one-click installers in cPanel.",
  },
  {
    question: "How many email accounts do I get?",
    answer: `${bronze.name} includes ${bronze.specs.email.toLowerCase()}, ${gold.name} ${gold.specs.email.toLowerCase()}, and ${platinum.name} and ${diamond.name} have ${platinum.specs.email.toLowerCase()}. Outbound sending is capped at 100 emails/hour on Bronze and 200/hour on Gold; Platinum and Diamond are unlimited.`,
  },
  {
    question: "Is migration from my current host free?",
    answer:
      "Yes. Our team moves your website, files, databases and email from your current host at no extra cost on every shared plan, and you can upgrade between tiers later without moving servers.",
  },
];

export default function HostingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <Section backdrop={<HeroAtmosphere />} className="pt-10 sm:pt-20">
        <HostingHero />
      </Section>

      {/* Pricing directly under the hero. */}
      <Section id="pricing" className="bg-surface/30">
        <HostingPlans />
      </Section>

      <Section id="specs">
        <PlanSpecTable plans={sharedPlans} groups={hostingSpecGroups(sharedPlans)} />
      </Section>

      <Section id="infrastructure" className="bg-surface/30">
        <Infrastructure />
      </Section>

      <Section id="faq">
        <Faq items={hostingFaqs} />
      </Section>

      <Section id="cta" className="bg-surface/30">
        <FinalCta />
      </Section>
    </>
  );
}
