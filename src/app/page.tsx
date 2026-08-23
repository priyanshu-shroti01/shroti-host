import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero } from "@/components/home/hero";
import { HostBuildScale } from "@/components/home/host-build-scale";
import { TrustedTech } from "@/components/home/trusted-tech";
import { ThreeSteps } from "@/components/home/three-steps";
import { ProductEcosystem } from "@/components/home/product-ecosystem";
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

// Homepage-only metadata: the canonical and og:url live here (not in the
// layout) so 404s and sub-pages never inherit the homepage's. Title and
// description come from the layout defaults.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    siteName: "ShrotiHost",
    locale: "en_IN",
    type: "website",
  },
};

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

      {/* Pricing — plans directly under the hero. */}
      <Section id="pricing">
        <HostingPlans />
      </Section>

      {/* Trust strip — sits right under pricing. */}
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

      {/* The single feature statement on the page — no restated feature grids. */}
      <Section id="comparison">
        <ComparisonTable />
      </Section>

      {/* Infrastructure — the honest version of a "live server monitor" section: a real request-path diagram instead of invented uptime numbers. */}
      <Section id="infrastructure" className="bg-surface/30">
        <Infrastructure />
      </Section>

      <Section id="developers">
        <DeveloperFeatures />
      </Section>

      <Section id="testimonials" compact className="bg-surface/30">
        <Testimonials />
      </Section>

      {/* Conversion router — one question, straight to the right funnel. */}
      <Section id="project-selector" compact>
        <ProjectSelector />
      </Section>

      <Section id="faq" compact className="bg-surface/30">
        <Faq />
      </Section>

      {/* CTA — "Start now." */}
      <Section id="cta">
        <FinalCta />
      </Section>
    </>
  );
}
