import dynamic from "next/dynamic";
import { Hero } from "@/components/home/hero";
import { TrustedTech } from "@/components/home/trusted-tech";
import { ThreeSteps } from "@/components/home/three-steps";
import { ProductEcosystem } from "@/components/home/product-ecosystem";
import { WhyChoose } from "@/components/home/why-choose";
import { ComparisonTable } from "@/components/home/comparison-table";
import { HostingPlans } from "@/components/home/hosting-plans";
import { Testimonials } from "@/components/home/testimonials";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";
import { Section } from "@/components/ui/section";

// Below-fold interactive sections load as deferred chunks — they're still
// server-rendered, but their hydration JS stays out of the critical path.
const HostingAdvisor = dynamic(() =>
  import("@/components/home/hosting-advisor").then((m) => m.HostingAdvisor)
);
const DomainSearch = dynamic(() =>
  import("@/components/home/domain-search").then((m) => m.DomainSearch)
);
const Infrastructure = dynamic(() =>
  import("@/components/home/infrastructure").then((m) => m.Infrastructure)
);
const DeveloperFeatures = dynamic(() =>
  import("@/components/home/developer-features").then((m) => m.DeveloperFeatures)
);

export default function Home() {
  return (
    <>
      <Hero />

      {/* Pricing — RankHostZone's homepage puts plans directly under the hero. */}
      <Section id="pricing">
        <HostingPlans />
      </Section>

      {/* Trust strip — sits right under pricing, matching RankHostZone's stats row placement. */}
      <TrustedTech />

      {/* Products — "Here's everything we offer." */}
      <Section id="products">
        <ProductEcosystem />
      </Section>

      {/* Hosting Advisor — "Not sure which plan fits?" */}
      <Section id="advisor" className="bg-surface/30">
        <HostingAdvisor />
      </Section>

      {/* Domains — a concrete next action once you've seen price */}
      <Section id="domains">
        <DomainSearch />
      </Section>

      <Section id="steps" className="bg-surface/30">
        <ThreeSteps />
      </Section>

      <Section id="why">
        <WhyChoose />
      </Section>

      <Section id="comparison" className="bg-surface/30">
        <ComparisonTable />
      </Section>

      {/* Infrastructure — the honest version of a "live server monitor" section: a real request-path diagram instead of invented uptime numbers. */}
      <Section id="infrastructure">
        <Infrastructure />
      </Section>

      <Section id="developers" className="bg-surface/30">
        <DeveloperFeatures />
      </Section>

      <Section id="testimonials">
        <Testimonials />
      </Section>

      <Section id="faq" className="bg-surface/30">
        <Faq />
      </Section>

      {/* CTA — "Start now." */}
      <Section id="cta">
        <FinalCta />
      </Section>
    </>
  );
}
