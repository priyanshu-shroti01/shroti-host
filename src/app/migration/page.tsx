import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Migration } from "@/components/home/migration";
import { HostingPlans } from "@/components/home/hosting-plans";
import { FinalCta } from "@/components/home/final-cta";

export const metadata: Metadata = {
  title: "Free Website Migration",
  description:
    "Move your website to ShrotiHost for free — files, databases, and email, with minimal downtime.",
  alternates: { canonical: "/migration" },
};

export default function MigrationPage() {
  return (
    <>
      <Section className="pt-16 sm:pt-24 pb-0">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge tone="neutral">Migration</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            We&apos;ll move your site. Free.
          </h1>
        </Reveal>
      </Section>

      <Section>
        <Migration ctaHref="https://portal.shrotihost.in/submitticket.php" />
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
