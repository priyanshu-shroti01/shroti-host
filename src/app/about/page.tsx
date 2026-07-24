import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { CompanyTimeline } from "@/components/about/company-timeline";
import { MissionValues } from "@/components/about/mission-values";
import { Testimonials } from "@/components/home/testimonials";
import { FinalCta } from "@/components/home/final-cta";

export const metadata: Metadata = {
  title: "About",
  description:
    "ShrotiHost's story — founded 2023, rebuilt for 2026, and building toward VPS, Cloud Hosting, and an AI Hosting Advisor.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Section className="pt-16 sm:pt-24 pb-0">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge tone="neutral">About</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            To build India&apos;s most loved hosting platform.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">
            Premium infrastructure, real customer experience, and honest pricing — for students,
            developers, startups, and businesses.
          </p>
        </Reveal>
      </Section>

      <Section className="bg-surface/30">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <Eyebrow>Our story</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Where we&apos;ve been, where we&apos;re going.
          </h2>
        </div>
        <CompanyTimeline />
      </Section>

      <Section>
        <MissionValues />
      </Section>

      <Section className="bg-surface/30">
        <Testimonials />
      </Section>

      <Section id="cta">
        <FinalCta />
      </Section>
    </>
  );
}
