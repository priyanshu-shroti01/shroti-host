import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { modules } from "@/lib/modules";

export const metadata: Metadata = {
  title: "WHMCS Modules",
  description:
    "Browse WHMCS modules built by ShrotiHost: gateway fee management and WhatsApp billing notifications, with more in development.",
  alternates: { canonical: "/modules" },
};

export default function ModulesPage() {
  return (
    <Section className="pt-16 sm:pt-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <Eyebrow>WHMCS Modules</Eyebrow>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
          Extend your WHMCS billing platform.
        </h1>
        <p className="mt-4 text-lg text-text-secondary">
          Built and supported by ShrotiHost — modules that solve real billing and communication
          problems for hosting providers and WHMCS admins.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {modules.map((mod, i) => (
          <Reveal key={mod.slug} delay={i * 0.08}>
            <SpotlightCard className="h-full">
              <Link href={`/modules/${mod.slug}`} className="flex h-full flex-col p-7">
                <div className="flex items-start justify-between">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 text-brand-purple transition-transform duration-200 group-hover:rotate-6 group-hover:scale-110">
                    <mod.icon size={22} aria-hidden="true" />
                  </div>
                  {mod.pricing ? (
                    <Badge tone="purple">From ₹{mod.pricing[0].priceInr}{mod.pricing[0].period}</Badge>
                  ) : (
                    <Badge tone="neutral">{mod.trial}</Badge>
                  )}
                </div>
                <h2 className="mt-5 text-xl font-semibold text-text-primary">{mod.name}</h2>
                <p className="mt-2 text-sm text-text-secondary">{mod.tagline}</p>

                <ul className="mt-5 flex-1 space-y-2">
                  {mod.features.slice(0, 3).map((f) => (
                    <li key={f.title} className="text-xs text-text-muted">
                      · {f.title}
                    </li>
                  ))}
                </ul>

                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-purple">
                  View details
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border-strong p-5 text-center text-sm text-text-muted">
          <Sparkles size={16} className="shrink-0 text-brand-purple" aria-hidden="true" />
          More WHMCS modules are in active development.
        </div>
      </Reveal>
    </Section>
  );
}
