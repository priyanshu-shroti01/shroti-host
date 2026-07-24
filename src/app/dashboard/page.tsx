import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { DashboardPreview } from "@/components/home/dashboard-preview";
import { FinalCta } from "@/components/home/final-cta";

export const metadata: Metadata = {
  title: "Client Dashboard",
  description:
    "A tour of the ShrotiHost client dashboard — billing, domains, DNS, support, and file management in one place.",
  alternates: { canonical: "/dashboard" },
};

export default function DashboardTourPage() {
  return (
    <>
      <Section className="pt-16 sm:pt-24 pb-0">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge tone="neutral">Client Dashboard</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            See what you get before you sign up.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">
            Click through the tabs — this is the same layout your real dashboard uses.
          </p>
        </Reveal>
      </Section>

      <Section>
        <DashboardPreview />
      </Section>

      <Section id="cta" className="bg-surface/30">
        <FinalCta />
      </Section>
    </>
  );
}
