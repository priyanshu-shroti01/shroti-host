import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { LegalPlaceholder } from "@/components/legal/legal-placeholder";

export const metadata: Metadata = {
  title: "Refund Policy",
  robots: { index: false, follow: true },
  alternates: { canonical: "/legal/refund-policy" },
};

const sections = [
  "Eligibility for Refunds",
  "Refund Timeframes",
  "Non-Refundable Items",
  "How to Request a Refund",
  "Processing Time",
];

export default function RefundPolicyPage() {
  return (
    <Section className="pt-16 sm:pt-24">
      <LegalPlaceholder title="Refund Policy" sections={sections} />
    </Section>
  );
}
