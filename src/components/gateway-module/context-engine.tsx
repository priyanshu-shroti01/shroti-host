import { Section, Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { contextSignals, signalGroupLabels, type SignalGroup } from "@/lib/gateway-fees-module";

/**
 * The fourteen context signals, in the module's own three groups.
 *
 * Presented as an engine rather than a field list: a customer, a payment and a
 * commerce lane each feeding the same evaluation. The two signals a rule cannot
 * match on are marked rather than quietly omitted — the honest count is twelve
 * matchable out of fourteen carried.
 */

const GROUPS: { key: SignalGroup; blurb: string }[] = [
  { key: "customer", blurb: "Who is paying, and where they are." },
  { key: "payment", blurb: "How they are paying, and whether tax applies." },
];

const COMMERCE_BLURB = "What is on the invoice, and what kind of invoice it is.";

export function ContextEngine() {
  const matchable = contextSignals.filter((s) => s.matchable).length;

  return (
    <Section id="context" className="scroll-mt-24">
      <div className="max-w-2xl">
        <Eyebrow>Context</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Fourteen signals reach the rule engine
        </h2>
        <p className="mt-4 text-text-secondary">
          Before a single rule is tested, the module assembles the invoice&rsquo;s full context
          from WHMCS — the client and their group, the country and currency on the account, the
          gateway, the amounts, the cycle, and what kind of invoice this actually is.{" "}
          <span className="text-text-primary">{matchable} of the {contextSignals.length}</span> can
          be matched on directly; the other two are carried for the calculation and the audit trail.
        </p>
      </div>

      <Reveal className="mt-10 grid items-start gap-5 lg:grid-cols-2">
        <div className="grid gap-5">
          {GROUPS.filter((group) => group.key !== "commerce").map((group) => (
            <GroupCard key={group.key} groupKey={group.key} blurb={group.blurb} />
          ))}
        </div>
        <GroupCard groupKey="commerce" blurb={COMMERCE_BLURB} />
      </Reveal>
    </Section>
  );
}

function GroupCard({ groupKey, blurb }: { groupKey: SignalGroup; blurb: string }) {
  const signals = contextSignals.filter((signal) => signal.group === groupKey);
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-baseline justify-between">
        <h3 className="text-base font-semibold text-text-primary">{signalGroupLabels[groupKey]}</h3>
        <span className="font-mono text-xs text-text-muted">{signals.length}</span>
      </div>
      <p className="mt-1 text-sm text-text-muted">{blurb}</p>

      <ul className="mt-5 space-y-3">
        {signals.map((signal) => (
          <li key={signal.key} className="border-t border-border pt-3 first:border-0 first:pt-0">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-text-primary">{signal.label}</span>
              {!signal.matchable && (
                <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] text-text-muted">
                  carried only
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-text-muted">{signal.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
