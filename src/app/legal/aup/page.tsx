import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { LegalPlaceholder } from "@/components/legal/legal-placeholder";

export const metadata: Metadata = {
  title: "Acceptable Use Policy",
  robots: { index: false, follow: true },
  alternates: { canonical: "/legal/aup" },
};

const sections = [
  "Prohibited Content",
  "Prohibited Activities",
  "Resource Usage Limits",
  "Security Requirements",
  "Reporting Violations",
  "Enforcement Actions",
];

export default function AupPage() {
  return (
    <Section className="pt-16 sm:pt-24">
      <LegalPlaceholder title="Acceptable Use Policy" sections={sections} />
    </Section>
  );
}
