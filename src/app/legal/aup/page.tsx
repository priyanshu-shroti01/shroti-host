import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { LegalDocument } from "@/components/legal/legal-document";
import { acceptableUsePolicy } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Acceptable Use Policy",
  description: "What may and may not be hosted on ShrotiHost's network — content rules, email limits, security, and fair resource use.",
  alternates: { canonical: "/legal/aup" },
};

export default function Page() {
  return (
    <Section className="pt-16 sm:pt-24">
      <LegalDocument doc={acceptableUsePolicy} />
    </Section>
  );
}
