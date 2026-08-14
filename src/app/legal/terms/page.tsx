import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { LegalDocument } from "@/components/legal/legal-document";
import { termsOfService } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "ShrotiHost's terms of service — account registration, billing, fair use, service delivery, and your responsibilities, in plain language.",
  alternates: { canonical: "/legal/terms" },
};

export default function Page() {
  return (
    <Section className="pt-16 sm:pt-24">
      <LegalDocument doc={termsOfService} />
    </Section>
  );
}
