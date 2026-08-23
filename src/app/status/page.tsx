import type { Metadata } from "next";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { Section, Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { StatusBoard } from "@/components/status/status-board";
import { StatusScene } from "@/components/scenes/status-scene";

export const metadata: Metadata = {
  title: "Status",
  description: "ShrotiHost service notices — maintenance and incidents for hosting, DNS, email, network and billing, posted by the team.",
  alternates: { canonical: "/status" },
  // Pre-launch preview, not a real status feed — keep it out of the index
  // until live monitoring ships.
  robots: { index: false, follow: false },
};

export default function StatusPage() {
  return (
    <>
      <Section backdrop={<HeroAtmosphere />} className="pt-10 sm:pt-20 pb-0">
        <div className="grid gap-8 lg:grid-cols-[3fr_2fr] lg:items-center">
          <Reveal className="text-center lg:text-left">
            <Eyebrow>Service notices</Eyebrow>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tighter text-text-primary sm:text-5xl lg:text-6xl">
              Service notices, posted by the team.
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary lg:mx-0">
              Planned maintenance and incidents for hosting, DNS, email and billing are posted here manually. Live monitoring is on the roadmap.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="hidden lg:block">
            <StatusScene />
          </Reveal>
        </div>
      </Section>

      <Section>
        <StatusBoard />
        <div className="mt-10 flex justify-center">
          <Button href="https://portal.shrotihost.in/submitticket.php" variant="secondary" size="lg">
            Report an issue
          </Button>
        </div>
      </Section>
    </>
  );
}
