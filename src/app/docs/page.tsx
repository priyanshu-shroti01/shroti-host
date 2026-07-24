import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { KnowledgeSearch } from "@/components/docs/knowledge-search";
import { FinalCta } from "@/components/home/final-cta";

export const metadata: Metadata = {
  title: "Knowledge Base",
  description: "Search ShrotiHost documentation and frequently asked questions.",
  alternates: { canonical: "/docs" },
};

export default function DocsPage() {
  return (
    <>
      <Section className="pt-16 sm:pt-24 pb-0">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge tone="neutral">Knowledge Base</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            Find your answer.
          </h1>
        </Reveal>
      </Section>

      <Section>
        <KnowledgeSearch />
      </Section>

      <Section id="cta" className="bg-surface/30">
        <FinalCta />
      </Section>
    </>
  );
}
