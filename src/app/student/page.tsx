import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { StudentJourney } from "@/components/student/student-journey";
import { FinalCta } from "@/components/home/final-cta";

export const metadata: Metadata = {
  title: "Student Program",
  description:
    "Verified students get discounted hosting, a free launch subdomain, and free migration — built for learning, not just launching.",
  alternates: { canonical: "/student" },
};

export default function StudentPage() {
  return (
    <>
      <Section className="pt-16 sm:pt-24 pb-0">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge>Student Program</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            Launch your first project for less.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">
            Dedicated pricing for verified students. Here&apos;s exactly what happens when you
            sign up.
          </p>
        </Reveal>
      </Section>

      <Section>
        <StudentJourney />
      </Section>

      <Section className="bg-surface/30 py-14 sm:py-16">
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-4">
          {[
            "Student-only pricing",
            "Free SSL & free migration",
            "Launch subdomain, no domain required",
            "Daily backups & LiteSpeed performance",
          ].map((b) => (
            <p key={b} className="text-center text-sm text-text-secondary">
              {b}
            </p>
          ))}
        </div>
      </Section>

      <Section id="cta">
        <FinalCta />
      </Section>
    </>
  );
}
