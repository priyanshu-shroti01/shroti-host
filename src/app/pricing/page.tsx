import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { HostingConfigurator } from "@/components/hosting/hosting-configurator";
import { HostingPlans } from "@/components/home/hosting-plans";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, honest hosting pricing. Configure what you need and see the right plan match live, or compare all three plans side by side.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <Section className="pt-16 sm:pt-24 pb-0">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge tone="neutral">Pricing</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            Renewal pricing shown upfront. Always.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">
            No introductory price that triples at renewal. What you see is what you pay.
          </p>
        </Reveal>
      </Section>

      <Section>
        <HostingConfigurator />
      </Section>

      <Section className="bg-surface/30">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Compare</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Or see every tier side by side.
          </h2>
        </div>
        <div className="mt-12">
          <HostingPlans />
        </div>
      </Section>

      <Section>
        <Faq />
      </Section>

      <Section id="cta">
        <FinalCta />
      </Section>
    </>
  );
}
