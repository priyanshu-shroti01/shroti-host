import { ArrowRight } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { billingTypes, contextSignals, operators } from "@/lib/gateway-fees-module";

/**
 * What a rule actually looks like.
 *
 * Two things this section exists to be honest about, because both surprise
 * people: conditions combine with AND only — there is no OR and no nesting —
 * and half the operator set is reachable only at the engine level, not from
 * the admin screens.
 */

const CONDITION_ROWS = [
  { field: "Gateway", operator: "equals", value: "razorpay" },
  { field: "Client Group", operator: "equals", value: "Reseller" },
  { field: "Country", operator: "is not", value: "AE" },
  { field: "Minimum Subtotal", operator: "at least", value: "2,500.00" },
];

export function RuleBuilder() {
  const uiOperators = operators.filter((o) => o.ui);
  const engineOperators = operators.filter((o) => !o.ui);
  const matchableFields = contextSignals.filter((s) => s.matchable);

  return (
    <Section id="rules" className="scroll-mt-24">
      <div className="max-w-2xl">
        <Eyebrow>Rules</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          A rule is a condition set and an amount
        </h2>
        <p className="mt-4 text-text-secondary">
          Conditions combine with AND — every one has to match, and evaluation stops at the first
          that does not. Rules carry a priority, and the engine is exclusive: the highest-priority
          match wins and nothing after it is considered.
        </p>
      </div>

      <Reveal className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <p className="font-mono text-xs font-semibold uppercase tracking-wide text-brand-purple-text">
            When
          </p>
          <ul className="mt-4 space-y-2">
            {CONDITION_ROWS.map((row, index) => (
              <li key={row.field}>
                {index > 0 && (
                  <p className="py-1.5 pl-1 font-mono text-[11px] uppercase tracking-wide text-text-muted">
                    and
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface-raised px-3 py-2.5">
                  <span className="text-sm font-medium text-text-primary">{row.field}</span>
                  <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[11px] text-text-muted">
                    {row.operator}
                  </span>
                  <span className="font-mono text-sm text-brand-purple-text">{row.value}</span>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-6 font-mono text-xs font-semibold uppercase tracking-wide text-brand-purple-text">
            Then
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-brand-purple/40 bg-brand-purple/5 px-3 py-2.5">
              <p className="text-xs text-text-muted">Mode</p>
              <p className="mt-0.5 text-sm font-medium text-text-primary">Charge</p>
            </div>
            <div className="rounded-xl border border-brand-purple/40 bg-brand-purple/5 px-3 py-2.5">
              <p className="text-xs text-text-muted">Calculation</p>
              <p className="mt-0.5 text-sm font-medium text-text-primary">1.50% + fixed 3.00</p>
            </div>
            <div className="rounded-xl border border-border px-3 py-2.5">
              <p className="text-xs text-text-muted">Maximum Charge Cap</p>
              <p className="mt-0.5 text-sm font-medium text-text-primary">250.00</p>
            </div>
            <div className="rounded-xl border border-border px-3 py-2.5">
              <p className="text-xs text-text-muted">Priority</p>
              <p className="mt-0.5 text-sm font-medium text-text-primary">90</p>
            </div>
          </div>

          <p className="mt-5 flex items-start gap-2 text-xs text-text-muted">
            <ArrowRight size={14} className="mt-0.5 shrink-0 text-brand-purple" aria-hidden="true" />
            Tier steps can override the amount above a threshold, so the rate drops as invoices get
            larger without a second rule.
          </p>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-base font-semibold text-text-primary">
              {matchableFields.length} fields, {operators.length} operators
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              Five operators are available in the admin screens. The other five exist in the engine
              and are reachable for anyone scripting rules directly.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {uiOperators.map((operator) => (
                <span
                  key={operator.key}
                  className="rounded-full border border-brand-purple/40 bg-brand-purple/5 px-3 py-1 font-mono text-xs text-brand-purple-text"
                >
                  {operator.label}
                </span>
              ))}
              {engineOperators.map((operator) => (
                <span
                  key={operator.key}
                  className="rounded-full border border-border px-3 py-1 font-mono text-xs text-text-muted"
                  title="Engine-level: no admin control emits this operator"
                >
                  {operator.label}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-base font-semibold text-text-primary">
              Three billing models per gateway
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              A gateway that takes its cut before you see the money needs the charge grossed up, or
              you absorb the difference on every transaction.
            </p>
            <ul className="mt-4 space-y-3">
              {billingTypes.map((type) => (
                <li key={type.key} className="border-t border-border pt-3 first:border-0 first:pt-0">
                  <p className="font-mono text-sm text-text-primary">{type.label}</p>
                  <p className="mt-0.5 text-xs text-text-muted">{type.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
