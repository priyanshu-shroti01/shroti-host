"use client";

import { useMemo, useState } from "react";
import { Check, Info, X } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { useCurrency } from "@/components/currency-provider";
import { currencySymbols } from "@/lib/gateway-fees-module";
import {
  computeChargeableBase,
  evaluate,
  round2,
  type EvaluationContext,
  type LineItem,
} from "@/lib/gateway-fee-calc";
import {
  DEMO_TAX_RATE,
  demoBillingCycles,
  demoClientGroups,
  demoCountries,
  demoGateways,
  demoInvoices,
  demoRules,
} from "@/lib/gateway-fees-demo";
import { DecisionTrace } from "./decision-trace";
import { useAnimatedNumber } from "./use-animated-number";

/**
 * The live demo.
 *
 * Every figure on screen comes out of gateway-fee-calc.ts, the port of
 * Calculator.php — change one control and the whole trace re-derives, the way
 * it would on a real invoice. The rejected rules are shown alongside the
 * winning one on purpose: "exactly one rule applies" is the single most
 * misunderstood thing about the module, and watching three rules lose is a
 * faster explanation than a paragraph about conflict strategy.
 */

/** The module's default invoice label: `{gateway_name} Gateway {type}{percentage_suffix}`. */
function renderLabel(
  gatewayName: string,
  mode: "surcharge" | "discount",
  percentage: number,
  override?: string,
): string {
  if (override) return override;
  const type = mode === "discount" ? "Discount" : "Fee";
  const suffix = percentage > 0 ? ` @ ${percentage.toFixed(2)}%` : "";
  return `${gatewayName} Gateway ${type}${suffix}`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

const selectClass =
  "w-full rounded-full border border-border bg-surface-raised px-4 py-2.5 text-sm text-text-primary transition-colors hover:border-border-strong focus-visible:border-brand-purple";

export function FeeDemo() {
  const { currency } = useCurrency();
  const symbol = currencySymbols[currency];

  const [gatewayKey, setGatewayKey] = useState("razorpay");
  const [clientGroup, setClientGroup] = useState("Reseller");
  const [country, setCountry] = useState("IN");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [clientChargeable, setClientChargeable] = useState(true);
  const [excluded, setExcluded] = useState<string[]>(["latefee"]);

  const gateway = demoGateways.find((g) => g.key === gatewayKey) ?? demoGateways[0];
  const items = demoInvoices[currency];

  const result = useMemo(() => {
    const isChargeable = (item: LineItem) => !excluded.includes(item.id);

    // Tax follows the taxed line items, as WHMCS computes it.
    const taxComponent = round2(
      items.reduce((sum, item) => (item.taxed ? sum + item.amount * DEMO_TAX_RATE : sum), 0),
    );

    const base = computeChargeableBase(items, isChargeable, taxComponent, clientChargeable);

    const context: EvaluationContext = {
      invoice_id: "1042",
      client_id: "42",
      gateway: gateway.key,
      currency_code: currency,
      client_group: clientGroup,
      client_country: country,
      client_currency: currency,
      billing_cycle: billingCycle,
      subtotal: base.chargeableSubtotal,
      total: base.chargeableTotal,
      invoice_type: "standard",
      is_renewal: "0",
      promo_code: "",
      tax_enabled: taxComponent > 0 ? "1" : "0",
    };

    const evaluation = evaluate(demoRules, context, gateway, base);
    return { base, context, evaluation, taxComponent };
  }, [items, excluded, clientChargeable, gateway, currency, clientGroup, country, billingCycle]);

  const { base, evaluation, taxComponent } = result;
  const rawSubtotal = base.rawSubtotal;
  const charge = evaluation.amount;
  const total = round2(rawSubtotal + taxComponent + charge);

  const animatedCharge = useAnimatedNumber(charge);
  const animatedTotal = useAnimatedNumber(total);

  const fmt = (value: number, decimals = 2) =>
    `${value < 0 ? "−" : ""}${symbol}${Math.abs(value).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;

  const winner = evaluation.winner;
  const winningCalc = winner?.calculation;

  const feeLabel = winner
    ? renderLabel(
        gateway.name,
        winner.rule.adjustmentMode,
        winningCalc?.percentageAmount ?? 0,
        winner.rule.label,
      )
    : null;

  const includedCount = base.contributions.filter((c) => c.chargeable).length;

  const stages = [
    {
      label: "Context",
      value: `${clientGroup} · ${country} · ${billingCycle}`,
      hint: `${gateway.name}, billing type ${gateway.billingType}`,
    },
    {
      label: "Rules",
      value: winner ? winner.rule.name : "No rule matched",
      hint: winner
        ? `priority ${winner.rule.priority} · ${demoRules.filter((r) => r.gateway === gateway.key).length - 1} others stopped`
        : "nothing applies to this invoice",
    },
    {
      label: "Allocator",
      value: evaluation.blocked
        ? "Blocked"
        : `${includedCount} of ${items.length} items · ${fmt(base.chargeableSubtotal)}`,
      hint: evaluation.blocked ? evaluation.reason : "the fee base, after exclusions",
    },
    {
      label: "Charge",
      value: charge === 0 ? "None" : fmt(charge),
      hint: winner && charge !== 0 ? feeLabel ?? undefined : "no line item is added",
    },
  ];

  return (
    <Section id="demo" className="scroll-mt-24 bg-surface/30">
      <div className="max-w-2xl">
        <Eyebrow>Live demo</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Change one thing. Watch the whole decision move.
        </h2>
        <p className="mt-4 text-text-secondary">
          Every number below is produced by the module&rsquo;s own calculation, ported
          line-for-line and unit-tested against the PHP. Switch the gateway, the group, the
          country — or take an item out of the fee base — and the trace re-derives exactly as it
          would on a real invoice.
        </p>
      </div>

      <Reveal className="mt-10">
        <DecisionTrace stages={stages} active={3} className="border-y border-border py-8" />

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          {/* ---------------------------- controls ---------------------------- */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-base font-semibold text-text-primary">Invoice context</h3>

            <div className="mt-5 space-y-4">
              <Field label="Gateway">
                <div className="grid grid-cols-2 gap-2">
                  {demoGateways.map((option) => {
                    const active = option.key === gatewayKey;
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setGatewayKey(option.key)}
                        aria-pressed={active}
                        className={`rounded-full border px-3 py-2.5 text-sm transition-colors ${
                          active
                            ? "border-brand-purple bg-brand-purple/10 text-brand-purple-text"
                            : "border-border bg-surface-raised text-text-secondary hover:border-border-strong"
                        }`}
                      >
                        {option.name}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Client group">
                <select
                  className={selectClass}
                  value={clientGroup}
                  onChange={(event) => setClientGroup(event.target.value)}
                >
                  {demoClientGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Country">
                  <select
                    className={selectClass}
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                  >
                    {demoCountries.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Billing cycle">
                  <select
                    className={selectClass}
                    value={billingCycle}
                    onChange={(event) => setBillingCycle(event.target.value)}
                  >
                    {demoBillingCycles.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <button
                type="button"
                onClick={() => setClientChargeable((value) => !value)}
                aria-pressed={!clientChargeable}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
                  clientChargeable
                    ? "border-border bg-surface-raised text-text-secondary hover:border-border-strong"
                    : "border-warning bg-warning/10 text-text-primary"
                }`}
              >
                <span>
                  <span className="block font-medium text-text-primary">Client exception</span>
                  <span className="text-xs text-text-muted">
                    {clientChargeable ? "This client is chargeable" : "Excluded from all charges"}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={`ml-3 flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors ${
                    clientChargeable ? "border-border-strong bg-bg" : "border-warning bg-warning/30"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full bg-text-secondary transition-transform ${
                      clientChargeable ? "translate-x-1" : "translate-x-6"
                    }`}
                  />
                </span>
              </button>
            </div>

            <p className="mt-5 flex items-start gap-2 text-xs text-text-muted">
              <Info size={14} className="mt-0.5 shrink-0 text-brand-purple" aria-hidden="true" />
              Example configuration. The module reads whatever gateways your WHMCS has and
              hardcodes none. Fixed amounts are never converted between currencies — switch the
              currency above and watch PayPal&rsquo;s fixed component stay the same number.
            </p>
          </div>

          {/* ---------------------------- invoice ----------------------------- */}
          <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="text-base font-semibold text-text-primary">Invoice #1042</h3>
              <span className="font-mono text-xs text-text-muted">{currency}</span>
            </div>

            <div className="px-6 py-4">
              <p className="mb-3 text-xs text-text-muted">
                Toggle a line to take it out of the fee base — the Items screen does this per
                product, addon, TLD or invoice type.
              </p>

              <ul className="space-y-1">
                {base.contributions.map(({ item, chargeable }) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      aria-pressed={!chargeable}
                      onClick={() =>
                        setExcluded((current) =>
                          current.includes(item.id)
                            ? current.filter((id) => id !== item.id)
                            : [...current, item.id],
                        )
                      }
                      className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-surface-raised"
                    >
                      <span
                        aria-hidden="true"
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                          chargeable
                            ? "border-brand-purple bg-brand-purple/20 text-brand-purple"
                            : "border-border text-text-disabled"
                        }`}
                      >
                        {chargeable ? <Check size={12} /> : <X size={12} />}
                      </span>
                      <span
                        className={`flex-1 text-sm ${
                          chargeable ? "text-text-primary" : "text-text-disabled line-through"
                        }`}
                      >
                        {item.label}
                      </span>
                      <span
                        className={`font-mono text-sm tabular-nums ${
                          chargeable ? "text-text-secondary" : "text-text-disabled"
                        }`}
                      >
                        {fmt(item.amount)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-text-secondary">Subtotal</dt>
                  <dd className="font-mono tabular-nums text-text-secondary">{fmt(rawSubtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-secondary">Tax</dt>
                  <dd className="font-mono tabular-nums text-text-secondary">{fmt(taxComponent)}</dd>
                </div>

                {charge !== 0 && feeLabel ? (
                  <div className="flex justify-between rounded-xl bg-brand-purple/10 px-3 py-2">
                    <dt className="pr-3 text-text-primary">{feeLabel}</dt>
                    <dd className="font-mono tabular-nums text-brand-purple-text">
                      {charge > 0 ? "+" : ""}
                      {fmt(animatedCharge)}
                    </dd>
                  </div>
                ) : (
                  <div className="flex justify-between rounded-xl bg-surface-raised px-3 py-2">
                    <dt className="pr-3 text-text-muted">No gateway line</dt>
                    <dd className="font-mono text-xs text-text-muted">
                      {evaluation.blocked ? evaluation.reason : "no rule matched"}
                    </dd>
                  </div>
                )}

                <div className="flex items-baseline justify-between border-t border-border pt-3">
                  <dt className="text-base font-semibold text-text-primary">Total</dt>
                  <dd className="font-mono text-xl font-semibold tabular-nums text-text-primary">
                    {fmt(animatedTotal)}
                  </dd>
                </div>
              </dl>
            </div>

            {/* --------------------- rule evaluation ------------------------- */}
            <div className="border-t border-border px-6 py-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                Rule evaluation · highest priority first
              </h4>
              <ul className="mt-3 space-y-1.5">
                {evaluation.outcomes
                  .filter((outcome) => outcome.skipped !== "other-gateway")
                  .map((outcome) => {
                    const isWinner = outcome === winner;
                    const failed = outcome.results.find((r) => !r.matched);
                    return (
                      <li
                        key={outcome.rule.id}
                        className={`flex items-baseline justify-between gap-3 rounded-xl px-3 py-2 text-sm ${
                          isWinner ? "bg-brand-purple/10" : ""
                        }`}
                      >
                        <span
                          className={isWinner ? "font-medium text-brand-purple-text" : "text-text-muted"}
                        >
                          {outcome.rule.name}
                        </span>
                        <span className="text-right font-mono text-xs text-text-muted">
                          {isWinner
                            ? `applied · ${fmt(outcome.calculation?.amount ?? 0)}`
                            : outcome.skipped === "superseded"
                              ? "matched, but a higher rule already won"
                              : failed
                                ? `${failed.condition.type} ≠ ${failed.condition.value}`
                                : "not applicable"}
                        </span>
                      </li>
                    );
                  })}
              </ul>
              {evaluation.capped ? (
                <p className="mt-3 text-xs text-warning">
                  {evaluation.capped === "surcharge"
                    ? `Capped at the invoice ceiling (${fmt(evaluation.ceiling ?? 0)}).`
                    : evaluation.capped === "discount"
                      ? "Discount clamped so the invoice cannot go negative."
                      : "Suppressed — nothing on this invoice can be charged on."}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
