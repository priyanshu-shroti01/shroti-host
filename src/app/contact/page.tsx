import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { ContactPaths } from "@/components/contact/contact-paths";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with ShrotiHost — sales, support, migration, technical, partnership, or billing.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Section className="pt-16 sm:pt-24 pb-0">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge tone="neutral">Contact</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            What&apos;s this about?
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">
            Pick a category and we&apos;ll route you to the right place.
          </p>
        </Reveal>
      </Section>

      <Section>
        <ContactPaths />
      </Section>
    </>
  );
}
