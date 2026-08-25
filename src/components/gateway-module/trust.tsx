import { FileClock, KeyRound, ShieldCheck, Database } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

/**
 * Technical trust, from verified behaviour only.
 *
 * No compliance badges, no uptime figures, no security claims the code does not
 * support. Everything below is something the module demonstrably does.
 */

const POINTS = [
  {
    icon: FileClock,
    title: "Every calculation is kept",
    body: "Each applied charge stores a snapshot: the rule as it was, the full context as it was, and the amount. Superseded calculations are marked rather than deleted, so an invoice's history survives a rule change.",
  },
  {
    icon: Database,
    title: "Twenty-two named log events",
    body: "Suppressed charges, capped discounts, blocked gateways, recalculation fallbacks and credit that needs a human look — each is its own event with the raw payload attached. Errors also mirror into the WHMCS module log. Retention is configurable.",
  },
  {
    icon: ShieldCheck,
    title: "Contained failures",
    body: "All eleven hooks are individually wrapped, so an exception is reported and contained instead of taking down a page. Admin writes are CSRF-checked, the customer-facing gateway change validates WHMCS's own token, and the preview endpoint is token-gated and rate-limited.",
  },
  {
    icon: KeyRound,
    title: "Licensed per installation",
    body: "Validation is bound to the installation and cached locally with an encrypted blob. If the licence is inactive the module registers no hooks at all — it goes dormant rather than degrading, and your invoices are untouched.",
  },
];

export function Trust() {
  return (
    <Section id="trust" className="scroll-mt-24 bg-surface/30" compact>
      <div className="max-w-2xl">
        <Eyebrow>Built to be audited</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          You can always answer &ldquo;why was I charged this?&rdquo;
        </h2>
      </div>

      <Reveal className="mt-10 grid gap-5 sm:grid-cols-2">
        {POINTS.map((point) => (
          <div
            key={point.title}
            className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
          >
            <point.icon size={20} className="text-brand-purple" aria-hidden="true" />
            <h3 className="mt-3 text-base font-semibold text-text-primary">{point.title}</h3>
            <p className="mt-2 text-sm text-text-secondary">{point.body}</p>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
