import { Hero } from "@/components/home/hero";
import { TrustedTech } from "@/components/home/trusted-tech";
import { DomainSearch } from "@/components/home/domain-search";
import { HostingAdvisor } from "@/components/home/hosting-advisor";
import { ProductEcosystem } from "@/components/home/product-ecosystem";
import { WhyChoose } from "@/components/home/why-choose";
import { DeveloperFeatures } from "@/components/home/developer-features";
import { Infrastructure } from "@/components/home/infrastructure";
import { DashboardPreview } from "@/components/home/dashboard-preview";
import { Migration } from "@/components/home/migration";
import { StudentProgram } from "@/components/home/student-program";
import { StartupProgram } from "@/components/home/startup-program";
import { HostingPlans } from "@/components/home/hosting-plans";
import { Testimonials } from "@/components/home/testimonials";
import { FinalCta } from "@/components/home/final-cta";
import { Section } from "@/components/ui/section";

export default function Home() {
  return (
    <>
      {/* Hero — "We help you launch." */}
      <Hero />
      <TrustedTech />

      {/* Domain Search — "Find your identity." */}
      <Section id="domains" className="py-8 sm:py-10">
        <DomainSearch />
      </Section>

      {/* Hosting Advisor — "Tell us what you're building, we'll pick for you." */}
      <Section id="advisor" className="bg-surface/30">
        <HostingAdvisor />
      </Section>

      {/* Products — "Here's everything we offer." */}
      <Section id="products">
        <ProductEcosystem />
      </Section>

      {/* Why ShrotiHost — narrative bridge into the story */}
      <Section id="why" className="bg-surface/30">
        <WhyChoose />
      </Section>

      <Section id="developers">
        <DeveloperFeatures />
      </Section>

      {/* Technology — "Here's why it's fast." */}
      <Section id="infrastructure" className="bg-surface/30">
        <Infrastructure />
      </Section>

      {/* Dashboard — "Here's what you'll use." */}
      <Section id="dashboard">
        <DashboardPreview />
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

      {/* Pricing — "Choose a plan." */}
      <Section id="plans" className="bg-surface/30">
        <HostingPlans />
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
