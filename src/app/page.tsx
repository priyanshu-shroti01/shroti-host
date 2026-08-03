import { Hero } from "@/components/home/hero";
import { TrustedTech } from "@/components/home/trusted-tech";
import { HostingAdvisor } from "@/components/home/hosting-advisor";
import { ThreeSteps } from "@/components/home/three-steps";
import { ProductEcosystem } from "@/components/home/product-ecosystem";
import { WhyChoose } from "@/components/home/why-choose";
import { Infrastructure } from "@/components/home/infrastructure";
import { ComparisonTable } from "@/components/home/comparison-table";
import { DeveloperFeatures } from "@/components/home/developer-features";
import { Migration } from "@/components/home/migration";
import { StudentProgram } from "@/components/home/student-program";
import { StartupProgram } from "@/components/home/startup-program";
import { HostingPlans } from "@/components/home/hosting-plans";
import { DomainSearch } from "@/components/home/domain-search";
import { Testimonials } from "@/components/home/testimonials";
import { FinalCta } from "@/components/home/final-cta";
import { Section } from "@/components/ui/section";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustedTech />

      {/* Hosting Advisor — "Not sure which plan fits?" */}
      <Section id="advisor">
        <HostingAdvisor />
      </Section>

      {/* Pricing */}
      <Section id="pricing">
        <HostingPlans />
      </Section>

      <Section id="steps" className="bg-surface/30">
        <ThreeSteps />
      </Section>

      {/* Domains — a concrete next action once you've seen price */}
      <Section id="domains">
        <DomainSearch />
      </Section>

      {/* Products — "Here's everything we offer." */}
      <Section id="products">
        <ProductEcosystem />
      </Section>

      <Section id="why">
        <WhyChoose />
      </Section>

      {/* Infrastructure — proof behind WhyChoose's "Deploy" claim */}
      <Section id="infrastructure" className="bg-surface/30">
        <Infrastructure />
      </Section>

      <Section id="comparison">
        <ComparisonTable />
      </Section>

      <Section id="developers">
        <DeveloperFeatures />
      </Section>

      {/* Migration — "Switch easily." */}
      <Section id="migration" className="bg-surface/30">
        <Migration />
      </Section>

      <Section id="student">
        <StudentProgram />
      </Section>

      <Section id="startup" className="pt-0">
        <StartupProgram />
      </Section>

      <Section id="testimonials">
        <Testimonials />
      </Section>

      {/* CTA — "Start now." */}
      <Section id="cta">
        <FinalCta />
      </Section>
    </>
  );
}
