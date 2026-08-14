import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { LegalDocument } from "@/components/legal/legal-document";
import { privacyPolicy } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What data ShrotiHost collects, how it's used and protected, and your rights under India's DPDP Act 2023. We never sell your data.",
  alternates: { canonical: "/legal/privacy" },
};

export default function Page() {
  return (
    <Section className="pt-16 sm:pt-24">
      <LegalDocument doc={privacyPolicy} />
    </Section>
  );
}
