import type { Metadata } from "next";
import { Check, Rocket } from "lucide-react";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { Section, Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoleCard } from "@/components/careers/role-card";
import { TrustedTech } from "@/components/home/trusted-tech";
import { CAREERS_EMAIL, CAREERS_WHATSAPP, hiringSteps, openRoles, whyJoin } from "@/lib/careers";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join ShrotiHost — help build the hosting platform behind India's websites. Remote-first, small team, real infrastructure. Open roles in support and engineering.",
  alternates: { canonical: "/careers" },
};

/** JobPosting structured data, generated from the same file the page renders. */
function jobPostingJsonLd() {
  return openRoles.map((role) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: role.title,
    description: `${role.summary} Responsibilities: ${role.responsibilities.join("; ")}.`,
    datePosted: role.posted,
    validThrough: role.closes,
    url: `${SITE_URL}/careers`,
    employmentType: role.type === "Full-time" ? "FULL_TIME" : role.type === "Part-time" ? "PART_TIME" : "INTERN",
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: { "@type": "Country", name: "India" },
    hiringOrganization: {
      "@type": "Organization",
      name: "ShrotiHost",
      url: SITE_URL,
      sameAs: SITE_URL,
      logo: `${SITE_URL}/icon.png`,
    },
    directApply: true,
  }));
}

export default function CareersPage() {
  return (
    <>
      {jobPostingJsonLd().map((ld) => (
        <script key={ld.title} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}

      {/* One scene, one message: your work here keeps real websites online. */}
      <Section backdrop={<HeroAtmosphere />} className="pt-10 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <Eyebrow>Careers</Eyebrow>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tighter text-text-primary sm:text-5xl lg:text-6xl">
              Keep India&apos;s websites{" "}
              <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">online.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-text-secondary">
              We&apos;re a small, remote-first team running real infrastructure for
              thousands of sites. Every role here touches production.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href="#open-roles" size="lg">
                See open roles
                <Rocket size={18} aria-hidden="true" />
              </Button>
              <Button href={CAREERS_WHATSAPP} variant="secondary" size="lg">
                Chat with the team
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      <TrustedTech />

      {/* Open roles — rendered from src/lib/careers.ts */}
      <Section id="open-roles" className="bg-surface/30">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>{openRoles.length > 0 ? `${openRoles.length} open role${openRoles.length > 1 ? "s" : ""}` : "Roles"}</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Open roles
          </h2>
          <p className="mt-4 text-text-secondary">
            Remote across India. Apply in one email — no forms, no portals.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl gap-6">
          {openRoles.length > 0 ? (
            openRoles.map((role, i) => (
              <Reveal key={role.slug} delay={i * 0.08}>
                <RoleCard role={role} />
              </Reveal>
            ))
          ) : (
            <Reveal>
              <Card className="text-center">
                <h3 className="text-xl font-semibold text-text-primary">No openings right now</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
                  We still read every note. If you&apos;re good at keeping websites fast
                  and people happy, introduce yourself.
                </p>
                <div className="mt-6">
                  <Button href={`mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent("Open application")}`}>
                    Send an open application
                  </Button>
                </div>
              </Card>
            </Reveal>
          )}
        </div>
      </Section>

      {/* Why join — four concrete realities, not perks-wallpaper */}
      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Why here</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Small team. Production stakes.
          </h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2">
          {whyJoin.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <Card className="h-full">
                <h3 className="text-lg font-semibold text-text-primary">{item.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{item.text}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Hiring loop — the site's canonical checklist/step pattern */}
      <Section className="bg-surface/30">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>How we hire</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Four steps, about a week.
          </h2>
        </div>
        <div className="mx-auto mt-12 max-w-2xl">
          <ol className="space-y-4">
            {hiringSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.06}>
                <li className="flex items-start gap-4 rounded-2xl border-2 border-border bg-card p-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-success/40 bg-success/10 text-success">
                    <Check size={15} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-text-primary">
                      <span className="mr-2 text-sm text-text-muted">{i + 1}.</span>
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-text-secondary">{step.text}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
          <p className="mt-8 text-center text-sm text-text-muted">
            Questions first?{" "}
            <a className="font-semibold text-brand-purple-text hover:underline" href={`mailto:${CAREERS_EMAIL}`}>
              {CAREERS_EMAIL}
            </a>
          </p>
        </div>
      </Section>
    </>
  );
}
