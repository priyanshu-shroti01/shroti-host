import type { Metadata } from "next";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { SupportScene } from "@/components/scenes/support-scene";
import { ContactPaths } from "@/components/contact/contact-paths";
import { TrustedTech } from "@/components/home/trusted-tech";
import { FinalCta } from "@/components/home/final-cta";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with ShrotiHost — sales, support, migration, technical, partnership, or billing.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Section backdrop={<HeroAtmosphere />} className="pt-10 sm:pt-20 pb-0">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[3fr_2fr] lg:items-center">
          <Reveal className="text-center lg:text-left">
            <Badge tone="neutral">Contact</Badge>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
              Talk to a real person.
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary lg:mx-0">
              Tell us what it&apos;s about — we&apos;ll route you straight to the right
              channel, no phone trees.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="hidden lg:block">
            <SupportScene />
          </Reveal>
        </div>
      </Section>

      <Section className="pb-14 sm:pb-16">
        <ContactPaths />
      </Section>

      <TrustedTech />

      <Section id="cta" className="bg-surface/30">
        <FinalCta />
      </Section>
    </>
  );
}
