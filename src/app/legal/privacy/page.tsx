import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { LegalPlaceholder } from "@/components/legal/legal-placeholder";

export const metadata: Metadata = {
  title: "Privacy Policy",
  robots: { index: false, follow: true },
  alternates: { canonical: "/legal/privacy" },
};

const sections = [
  "Information We Collect",
  "How We Use Information",
  "Data Sharing & Third Parties",
  "Cookies",
  "Data Security",
  "Your Rights",
  "Data Retention",
  "Contact for Privacy Concerns",
];

export default function PrivacyPage() {
  return (
    <Section className="pt-16 sm:pt-24">
      <LegalPlaceholder title="Privacy Policy" sections={sections} />
    </Section>
  );
}
