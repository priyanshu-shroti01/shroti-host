import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { GrowthTimeline } from "@/components/startup/growth-timeline";
import { HostingPlans } from "@/components/home/hosting-plans";
import { FinalCta } from "@/components/home/final-cta";

export const metadata: Metadata = {
  title: "Startup Program",
  description:
    "Hosting that grows with your company — from idea to enterprise. See what's recommended at each stage.",
  alternates: { canonical: "/startup" },
};

export default function StartupPage() {
  return (
    <>
      <Section className="pt-16 sm:pt-24 pb-0">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge>Startup Program</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            Launch your MVP without infrastructure headaches.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">
            Click a stage — the recommendation changes with you, not the other way around.
          </p>
        </Reveal>
      </Section>

      <Section>
        <GrowthTimeline />
      </Section>

      <Section className="bg-surface/30">
        <HostingPlans />
      </Section>

      <Section id="cta">
        <FinalCta />
      </Section>
    </>
  );
}
