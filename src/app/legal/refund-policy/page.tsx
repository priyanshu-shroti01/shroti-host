import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { LegalDocument } from "@/components/legal/legal-document";
import { refundPolicy } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "ShrotiHost's 7-day money-back guarantee on first hosting purchases — eligibility, non-refundable items, and how to request a refund.",
  alternates: { canonical: "/legal/refund-policy" },
};

export default function Page() {
  return (
    <Section className="pt-16 sm:pt-24">
      <LegalDocument doc={refundPolicy} />
    </Section>
  );
}
