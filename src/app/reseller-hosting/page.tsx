import type { Metadata } from "next";
import { PlanSpecTable } from "@/components/hosting/plan-spec-table";
import { resellerSpecGroups } from "@/lib/plan-specs";
import { hostingProductJsonLd } from "@/lib/seo";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { Section } from "@/components/ui/section";
import { ResellerHero } from "@/components/reseller/reseller-hero";
import { ResellerBenefits } from "@/components/reseller/reseller-benefits";
import { Infrastructure } from "@/components/home/infrastructure";
import { HostingPlans } from "@/components/home/hosting-plans";
import { storeGroups } from "@/lib/whmcs";
import { Faq, type FaqItem } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";
import { resellerPlans } from "@/lib/plans";

// Real entry price from lib/plans.ts — never hard-coded in copy.
const fromPrice = Math.min(...resellerPlans.map((p) => p.monthlyPrice));
const [bronze, gold, platinum, diamond] = resellerPlans;

export const metadata: Metadata = {
  title: `Reseller Hosting in India from ₹${fromPrice}/mo`,
  description:
    "Start your own hosting business — full WHM access, white-label branding, and free WHMCS billing software on every plan.",
  alternates: { canonical: "/reseller-hosting" },
};

const productJsonLd = hostingProductJsonLd({
  name: "Reseller Hosting",
  description: "White-label reseller hosting with WHM, free WHMCS billing, and JetBackup.",
  path: "/reseller-hosting",
  plans: resellerPlans,
});

/** Reseller-line questions, answered from lib/plans.ts and lib/plan-specs.ts. */
const resellerFaqs: FaqItem[] = [
  {
    question: "How much does reseller hosting cost?",
    answer: `${bronze.name} starts at ₹${bronze.monthlyPrice}/month for ${bronze.specs.websites.toLowerCase()} and ${bronze.specs.storage} storage. ${gold.name} (₹${gold.monthlyPrice}/mo) allows ${gold.specs.websites.toLowerCase()} on ${gold.specs.storage}, ${platinum.name} (₹${platinum.monthlyPrice}/mo) ${platinum.specs.websites.toLowerCase()} on ${platinum.specs.storage}, and ${diamond.name} (₹${diamond.monthlyPrice}/mo) ${diamond.specs.websites.toLowerCase()} on ${diamond.specs.storage.toLowerCase()} storage. Bandwidth is unmetered and renewals cost the same as the first term.`,
  },
  {
    question: "Is WHMCS billing software included?",
    answer:
      "Yes. Free WHMCS billing software comes with every reseller plan, alongside a WHM control panel, custom hosting packages and overselling support — so orders, invoices and account provisioning run without manual work.",
  },
  {
    question: "Can my customers tell that ShrotiHost is behind my hosting?",
    answer:
      "No. Every plan is fully white-label: private nameservers on your own domain and your branding on every cPanel account you create. Your customers see your company, not ours.",
  },
  {
    question: "What limits apply to each cPanel account I create?",
    answer:
      "Each account runs on CloudLinux with up to 400% CPU, 8 GB RAM, 8,192 IOPS, 400 processes and 80 entry processes, with unlimited mailboxes, parked and addon domains. You set the package sizes yourself in WHM.",
  },
  {
    question: "Are backups and SSL covered for my clients' sites?",
    answer:
      "Yes. Daily JetBackup backups, free SSL certificates and Imunify360 + DDoS protection apply to every account on your reseller plan, and we migrate your existing client sites for free.",
  },
];

export default function ResellerHostingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <Section backdrop={<HeroAtmosphere />} className="pt-10 sm:pt-20">
        <ResellerHero />
      </Section>

      <Section id="pricing" className="bg-surface/30">
        <HostingPlans plans={resellerPlans} orderUrl={storeGroups.reseller} />
      </Section>

      <Section id="specs">
        <PlanSpecTable plans={resellerPlans} groups={resellerSpecGroups(resellerPlans)} />
      </Section>

      <Section className="py-14 sm:py-16">
        <ResellerBenefits />
      </Section>

      <Section id="infrastructure" className="bg-surface/30">
        <Infrastructure />
      </Section>

      <Section id="faq">
        <Faq items={resellerFaqs} />
      </Section>

      <Section id="cta" className="bg-surface/30">
        <FinalCta />
      </Section>
    </>
  );
}
