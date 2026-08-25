import { Boxes, Globe2, Package, Receipt, UserMinus } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { itemTypes } from "@/lib/gateway-fees-module";

/**
 * The allocator.
 *
 * The point this section has to land: the fee base is not the invoice total.
 * An invoice explodes into its line items, each resolves to a type the module
 * can switch on or off, and only the survivors are charged on — with the tax
 * component prorated by the surviving share rather than recomputed. That
 * proration is the detail that keeps discounts from going tax-negative, and it
 * is the sort of thing a buyer evaluating billing software actually cares about.
 */

const ITEM_ICONS = { product: Package, addon: Boxes, tld: Globe2, other: Receipt } as const;

/** Illustrative figures, computed the way the module computes them. */
const EXAMPLE = {
  items: [
    { label: "VPS Hosting", amount: "2,000.00", chargeable: true },
    { label: "Domain renewal", amount: "799.00", chargeable: true },
    { label: "Daily Backups", amount: "299.00", chargeable: true },
    { label: "Late fee", amount: "150.00", chargeable: false },
  ],
  rawSubtotal: "3,248.00",
  chargeableSubtotal: "3,098.00",
  share: "95.4%",
};

export function Allocator() {
  return (
    <Section id="allocator" className="scroll-mt-24 bg-surface/30">
      <div className="max-w-2xl">
        <Eyebrow>The Allocator</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          The fee base is not the invoice total
        </h2>
        <p className="mt-4 text-text-secondary">
          Charging a flat percentage of an invoice total is the naive version, and it bills your
          customers for things you never paid a gateway to process. The allocator breaks the
          invoice into its line items, resolves each one to a type it can target, and charges only
          on what survives.
        </p>
      </div>

      <Reveal className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        {/* ------------------------- exploded invoice ------------------------ */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-baseline justify-between">
            <h3 className="text-base font-semibold text-text-primary">Invoice #1042</h3>
            <span className="font-mono text-sm text-text-muted">₹{EXAMPLE.rawSubtotal}</span>
          </div>

          {/* The invoice splits into its lines, and the lines converge again. */}
          <div className="relative mt-6 pl-6">
            <span
              aria-hidden="true"
              className="absolute left-0 top-2 bottom-14 w-px bg-border-strong"
            />
            <ul className="space-y-2.5">
              {EXAMPLE.items.map((item) => (
                <li key={item.label} className="relative">
                  <span
                    aria-hidden="true"
                    className={`absolute -left-6 top-1/2 h-px w-5 ${
                      item.chargeable ? "bg-brand-purple/60" : "bg-border"
                    }`}
                  />
                  <div
                    className={`flex items-center justify-between rounded-xl border px-3 py-2.5 ${
                      item.chargeable
                        ? "border-brand-purple/40 bg-brand-purple/5"
                        : "border-border bg-surface-raised"
                    }`}
                  >
                    <span
                      className={`text-sm ${
                        item.chargeable ? "text-text-primary" : "text-text-disabled line-through"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`font-mono text-sm tabular-nums ${
                        item.chargeable ? "text-text-secondary" : "text-text-disabled"
                      }`}
                    >
                      ₹{item.amount}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="relative mt-4">
              <span aria-hidden="true" className="absolute -left-6 top-1/2 h-px w-5 bg-brand-purple" />
              <div className="rounded-xl border border-brand-purple bg-brand-purple/10 px-3 py-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-text-primary">Fee base</span>
                  <span className="font-mono text-sm font-semibold tabular-nums text-brand-purple-text">
                    ₹{EXAMPLE.chargeableSubtotal}
                  </span>
                </div>
                <p className="mt-1 text-xs text-text-muted">
                  Tax is prorated by the surviving share ({EXAMPLE.share}), not recalculated.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --------------------------- mechanisms ---------------------------- */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-base font-semibold text-text-primary">
              Every line resolves to something you can switch off
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              The Items screen lists all four categories and toggles each one in or out of the fee
              base — no rule editing involved.
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {itemTypes.map((type) => {
                const Icon = ITEM_ICONS[type.key];
                return (
                  <li key={type.key} className="rounded-xl border border-border bg-surface-raised p-4">
                    <Icon size={18} className="text-brand-purple" aria-hidden="true" />
                    <p className="mt-2 text-sm font-medium text-text-primary">{type.label}</p>
                    <p className="mt-0.5 text-xs text-text-muted">{type.detail}</p>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-start gap-3">
              <UserMinus size={20} className="mt-0.5 shrink-0 text-brand-purple" aria-hidden="true" />
              <div>
                <h3 className="text-base font-semibold text-text-primary">
                  And one account can sit outside all of it
                </h3>
                <p className="mt-2 text-sm text-text-secondary">
                  A client marked as excluded is skipped before any rule is evaluated, and the
                  reason is written to the log. It is a switch, not a custom rate — the module has
                  no per-client percentages, and this page will not pretend otherwise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
