import type { Metadata } from "next";
import { Clock3, Sparkles, Star } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { BrandScene } from "@/components/scenes/brand-scene";
import { StatPill } from "@/components/ui/stat-pill";
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
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[3fr_2fr] lg:items-center">
          <Reveal className="text-center lg:text-left">
            <Badge tone="neutral">About</Badge>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
              To build India&apos;s most loved hosting platform.
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary lg:mx-0">
              Premium infrastructure, real customer experience, and honest pricing — for students,
              developers, startups, and businesses.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
              <StatPill icon={Clock3}>Serving customers since 2023</StatPill>
              <StatPill icon={Sparkles}>AI-assisted support, 24/7</StatPill>
              <StatPill icon={Star} iconClassName="text-warning" href="https://www.trustpilot.com/review/shrotihost.in">
                Reviewed on Trustpilot
              </StatPill>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="hidden lg:block">
            <BrandScene />
          </Reveal>
        </div>
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
