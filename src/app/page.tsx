import { Hero } from "@/components/home/hero";
import { TrustedTech } from "@/components/home/trusted-tech";
import { HostingAdvisor } from "@/components/home/hosting-advisor";
import { ThreeSteps } from "@/components/home/three-steps";
import { ProductEcosystem } from "@/components/home/product-ecosystem";
import { WhyChoose } from "@/components/home/why-choose";
import { Infrastructure } from "@/components/home/infrastructure";
import { ComparisonTable } from "@/components/home/comparison-table";
import { DeveloperFeatures } from "@/components/home/developer-features";
import { HostingPlans } from "@/components/home/hosting-plans";
import { DomainSearch } from "@/components/home/domain-search";
import { Testimonials } from "@/components/home/testimonials";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";
import { Section } from "@/components/ui/section";

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
