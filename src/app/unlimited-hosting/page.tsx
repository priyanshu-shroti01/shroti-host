import type { Metadata } from "next";
import { PlanSpecTable } from "@/components/hosting/plan-spec-table";
import { hostingSpecGroups } from "@/lib/plan-specs";
import { hostingProductJsonLd } from "@/lib/seo";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { Section } from "@/components/ui/section";
import { UnlimitedHero } from "@/components/unlimited/unlimited-hero";
import { Infrastructure } from "@/components/home/infrastructure";
import { HostingPlans } from "@/components/home/hosting-plans";
import { storeGroups } from "@/lib/whmcs";
import { Faq, type FaqItem } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";
import { sharedPlans, unlimitedPlans } from "@/lib/plans";

// Real entry price from lib/plans.ts — never hard-coded in copy.
const fromPrice = Math.min(...unlimitedPlans.map((p) => p.monthlyPrice));
const [bronze, gold, platinum, diamond] = unlimitedPlans;
const sharedDiamond = sharedPlans[sharedPlans.length - 1];

export const metadata: Metadata = {
  title: `Unlimited Hosting in India from ₹${fromPrice}/mo`,
  description:
    "Host unlimited websites on one plan — built for agencies, developers, and anyone managing multiple client sites. Same price, no per-site add-ons.",
  alternates: { canonical: "/unlimited-hosting" },
};

const productJsonLd = hostingProductJsonLd({
  name: "Unlimited Hosting",
  description: "Unmetered NVMe storage and bandwidth for agencies and multi-site owners.",
  path: "/unlimited-hosting",
  plans: unlimitedPlans,
});

/** Unlimited-line questions, answered from lib/plans.ts and lib/plan-specs.ts. */
const unlimitedFaqs: FaqItem[] = [
  {
    question: "What exactly is unlimited on these plans?",
    answer: `Storage and bandwidth: every Unlimited tier has unmetered NVMe storage and unmetered bandwidth. The tiers differ by how many websites you can host — ${bronze.specs.websites.toLowerCase()} on ${bronze.name}, ${gold.specs.websites.toLowerCase()} on ${gold.name}, ${platinum.specs.websites.toLowerCase()} on ${platinum.name}, ${diamond.specs.websites.toLowerCase()} on ${diamond.name} — and by the number of mailboxes.`,
  },
  {
    question: "How much does unlimited hosting cost?",
    answer: `${bronze.name} is ₹${bronze.monthlyPrice}/month, ${gold.name} ₹${gold.monthlyPrice}/month, ${platinum.name} ₹${platinum.monthlyPrice}/month and ${diamond.name} ₹${diamond.monthlyPrice}/month. Renewal pricing is identical to the signup price on every billing cycle.`,
  },
  {
    question: "Are there any CPU or RAM limits?",
    answer:
      "Yes — storage and bandwidth are unmetered, but compute is isolated per account with CloudLinux: up to 8 GB RAM, 4 CPU cores, 80 entry processes, 500 processes and 30 MB/s dedicated I/O. That isolation is what keeps one busy site from slowing down the others.",
  },
  {
    question: `Should I choose Unlimited ${bronze.name} or Shared ${sharedDiamond.name}?`,
    answer: `It depends on how many sites you run. Shared ${sharedDiamond.name} (₹${sharedDiamond.monthlyPrice}/mo) gives you ${sharedDiamond.specs.websites.toLowerCase()} on unmetered NVMe. Unlimited ${bronze.name} (₹${bronze.monthlyPrice}/mo) is ${bronze.specs.websites.toLowerCase()} with unmetered storage — the better fit for one large, media-heavy site. For many sites, compare Shared ${sharedDiamond.name} with Unlimited ${diamond.name} (₹${diamond.monthlyPrice}/mo).`,
  },
  {
    question: "Can I move client sites here for free?",
    answer:
      "Yes. Free migration, free SSL, daily JetBackup backups and Imunify360 protection apply to every site on the account, and you can upgrade to a higher tier at any time without changing servers.",
  },
];

export default function UnlimitedHostingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <Section backdrop={<HeroAtmosphere />} className="pt-10 sm:pt-20">
        <UnlimitedHero />
      </Section>

      <Section id="pricing" className="bg-surface/30">
        <HostingPlans plans={unlimitedPlans} orderUrl={storeGroups.unlimited} />
      </Section>

      <Section id="specs">
        <PlanSpecTable plans={unlimitedPlans} groups={hostingSpecGroups(unlimitedPlans)} />
      </Section>

      <Section id="infrastructure">
        <Infrastructure />
      </Section>

      <Section id="faq" className="bg-surface/30">
        <Faq items={unlimitedFaqs} />
      </Section>

      <Section id="cta">
        <FinalCta />
      </Section>
    </>
  );
}
