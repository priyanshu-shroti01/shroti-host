import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { VpsHero } from "@/components/vps/vps-hero";
import { VpsSliderPreview } from "@/components/vps/vps-slider-preview";
import { VpsRoadmap } from "@/components/vps/vps-roadmap";
import { FinalCta } from "@/components/home/final-cta";

export const metadata: Metadata = {
  title: "VPS Hosting — Coming Soon",
  description:
    "VPS hosting with dedicated vCPU, RAM, and NVMe storage is coming to ShrotiHost. Preview the resource configuration and get notified at launch.",
  alternates: { canonical: "/vps" },
};

export default function VpsPage() {
  return (
    <>
      <Section className="pt-16 sm:pt-24">
        <VpsHero />
      </Section>

      <Section className="bg-surface/30">
        <VpsSliderPreview />
      </Section>

      <Section>
        <VpsRoadmap />
      </Section>

      <Section id="cta">
        <FinalCta />
      </Section>
    </>
  );
}
