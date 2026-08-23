import type { Metadata } from "next";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { Section, Eyebrow } from "@/components/ui/section";
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
      {/* Tight hero padding: the contact paths are the page, not a second
          section 300px further down. */}
      <Section backdrop={<HeroAtmosphere />} className="pt-10 pb-6 sm:pt-16 sm:pb-8">
        <div className="grid gap-8 lg:grid-cols-[3fr_2fr] lg:items-center">
          <Reveal className="text-center lg:text-left">
            <Eyebrow>Contact</Eyebrow>
            <h1 className="mt-4 text-4xl font-extrabold leading-none tracking-tighter text-text-primary sm:text-5xl lg:text-6xl">
              Talk to a{" "}
              <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
                real person.
              </span>
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

      <Section className="pt-6 pb-14 sm:pt-8 sm:pb-16">
        <ContactPaths />
      </Section>

      <TrustedTech />

      <Section id="cta" className="bg-surface/30">
        <FinalCta />
      </Section>
    </>
  );
}
