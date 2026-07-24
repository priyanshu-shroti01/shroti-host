import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { LatestArticles } from "@/components/home/latest-articles";
import { FinalCta } from "@/components/home/final-cta";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guides, tips, and product updates from ShrotiHost. Launching soon.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <>
      <Section className="pt-16 sm:pt-24 pb-0">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge tone="neutral">Blog</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            Guides, tips, and product updates.
          </h1>
        </Reveal>
      </Section>

      <Section>
        <LatestArticles />
      </Section>

      <Section id="cta" className="bg-surface/30">
        <FinalCta />
      </Section>
    </>
  );
}
