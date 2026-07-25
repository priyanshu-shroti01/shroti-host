import { Hero } from "@/components/home/hero";
import { TrustedTech } from "@/components/home/trusted-tech";
import { ProductEcosystem } from "@/components/home/product-ecosystem";
import { WhyChoose } from "@/components/home/why-choose";
import { DeveloperFeatures } from "@/components/home/developer-features";
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
      <Hero />
      <TrustedTech />

      {/* Pricing */}
      <Section id="pricing">
        <HostingPlans />
      </Section>

      {/* Products — "Here's everything we offer." */}
      <Section id="products" className="bg-surface/30">
        <ProductEcosystem />
      </Section>

      <Section id="why">
        <WhyChoose />
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
