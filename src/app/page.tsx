import dynamic from "next/dynamic";
import { Hero } from "@/components/home/hero";
import { HostBuildScale } from "@/components/home/host-build-scale";
import { TrustedTech } from "@/components/home/trusted-tech";
import { EverythingIncluded } from "@/components/home/everything-included";
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
import { getDomainPricing } from "@/lib/domain-pricing.server";

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
const ProjectSelector = dynamic(() =>
  import("@/components/home/project-selector").then((m) => m.ProjectSelector)
);

// Live TLD pricing is exported from WHMCS daily — regenerate at most once a day.
export const revalidate = 86400;

export default async function Home() {
  const { domains } = await getDomainPricing();
  return (
    <>
      <Hero />

      {/* Brand architecture — HOST / BUILD / SCALE: the one-partner lifecycle,
          stated before any single product so everything after reads as part
          of a whole. */}
      <Section id="host-build-scale" className="bg-surface/30">
        <HostBuildScale />
      </Section>

      {/* Pricing — RankHostZone's homepage puts plans directly under the hero. */}
      <Section id="pricing">
        <HostingPlans />
      </Section>

      {/* Every-plan baseline — RankHostZone's "Every Plan Gets All This" grid. */}
      <Section id="everything" className="bg-surface/30">
        <EverythingIncluded />
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
        <DomainSearch domains={domains} />
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

      {/* Conversion router — one question, straight to the right funnel. */}
      <Section id="project-selector" className="bg-surface/30">
        <ProjectSelector />
      </Section>

      <Section id="faq">
        <Faq />
      </Section>

      {/* CTA — "Start now." */}
      <Section id="cta">
        <FinalCta />
      </Section>
    </>
  );
}
