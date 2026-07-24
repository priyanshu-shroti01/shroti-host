import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { LegalPlaceholder } from "@/components/legal/legal-placeholder";

export const metadata: Metadata = {
  title: "Terms of Service",
  robots: { index: false, follow: true },
  alternates: { canonical: "/legal/terms" },
};

const sections = [
  "Acceptance of Terms",
  "Service Description",
  "Account Responsibilities",
  "Payment & Billing",
  "Acceptable Use",
  "Service Availability",
  "Limitation of Liability",
  "Termination",
  "Governing Law",
  "Changes to These Terms",
];

export default function TermsPage() {
  return (
    <Section className="pt-16 sm:pt-24">
      <LegalPlaceholder title="Terms of Service" sections={sections} />
    </Section>
  );
}
