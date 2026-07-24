import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { IssuePicker } from "@/components/support/issue-picker";
import { FinalCta } from "@/components/home/final-cta";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Tell us what you need help with and get a quick answer, or open a ticket / start live chat with our team.",
  alternates: { canonical: "/support" },
};

export default function SupportPage() {
  return (
    <>
      <Section className="pt-16 sm:pt-24 pb-0">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge tone="neutral">Support</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            What do you need help with?
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">
            Pick a category for a quick answer, or go straight to a ticket or live chat.
          </p>
        </Reveal>
      </Section>

      <Section>
        <IssuePicker />
      </Section>

      <Section id="cta" className="bg-surface/30">
        <FinalCta />
      </Section>
    </>
  );
}
