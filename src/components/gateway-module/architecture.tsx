"use client";

import { useState } from "react";
import { Section, Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { adminPages, hooks } from "@/lib/gateway-fees-module";

/**
 * Where the module sits inside WHMCS.
 *
 * A stat row ("11 hooks · 9 pages · secure · reliable") tells a reader nothing.
 * This is the actual wiring: WHMCS reaches the module through three surfaces,
 * the engine resolves in a fixed order, and every node here names the real hook
 * or service behind it. Selecting a node is a genuine interaction, and it works
 * from the keyboard.
 */

type NodeKey = "invoice" | "cart" | "client" | "context" | "rules" | "calculator" | "allocator" | "charge";

const NODE_DETAIL: Record<NodeKey, { title: string; body: string; refs: string[] }> = {
  invoice: {
    title: "Invoice surface",
    body: "Four hooks keep an invoice correct for its whole life: when it is created, when the gateway changes, when its line items move, and when it is paid. The paid hook deliberately mutates nothing — the snapshot is left as history.",
    refs: ["InvoiceCreated", "InvoiceChangeGateway", "UpdateInvoiceTotal", "InvoicePaid"],
  },
  cart: {
    title: "Cart surface",
    body: "The checkout page gets a stylesheet, a signed preview token, the allocation map and a live preview fragment, so the customer sees the charge before they commit. Enforcement still happens on the invoice — the cart is a preview.",
    refs: ["ClientAreaHeadOutput", "ClientAreaFooterOutput", "ShoppingCartCheckoutOutput", "AfterShoppingCartCheckout"],
  },
  client: {
    title: "Client area surface",
    body: "The invoice's gateway list is filtered to what your allocation rules allow, and any gateway change is CSRF-validated before it is accepted. This is the one place gateway visibility is enforced server-side.",
    refs: ["ClientAreaPage", "ClientAreaPageViewInvoice"],
  },
  context: {
    title: "ContextBuilder",
    body: "Assembles the fourteen signals from WHMCS — client, group, country, currencies, cycle, amounts, invoice type, renewal state, promo code and tax state — for both the invoice and the live cart.",
    refs: ["ContextBuilder", "ChargeabilityService"],
  },
  rules: {
    title: "RuleEngine + ConditionMatcher",
    body: "Walks rules in priority order and tests each condition set with AND, stopping at the first failure. The strategy is exclusive: the first rule to match wins and evaluation ends there.",
    refs: ["RuleEngine", "ConditionMatcher"],
  },
  calculator: {
    title: "Calculator",
    body: "Resolves the base, picks a tier step if one applies, then computes fixed, percentage or both under the gateway's billing model. Caps clamp the magnitude; direction comes only from the rule's mode.",
    refs: ["Calculator"],
  },
  allocator: {
    title: "ChargeabilityService",
    body: "Decides which line items form the fee base, prorates the tax component by the surviving share, and short-circuits the whole evaluation for an excluded client.",
    refs: ["ChargeabilityService", "ChargeabilityRepository"],
  },
  charge: {
    title: "InvoiceFeeApplierService",
    body: "Owns exactly one line item per invoice, marked so it can always be found again. It applies the safety rails, asks WHMCS itself to recalculate totals, writes a snapshot, and never changes invoice status.",
    refs: ["InvoiceFeeApplierService", "SnapshotService"],
  },
};

function Node({
  id,
  label,
  selected,
  onSelect,
  className = "",
}: {
  id: NodeKey;
  label: string;
  selected: boolean;
  onSelect: (id: NodeKey) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      onFocus={() => onSelect(id)}
      aria-pressed={selected}
      className={`w-full rounded-xl border px-3 py-2.5 text-sm transition-colors ${
        selected
          ? "border-brand-purple bg-brand-purple/10 text-brand-purple-text"
          : "border-border bg-surface-raised text-text-secondary hover:border-border-strong"
      } ${className}`}
    >
      {label}
    </button>
  );
}

/** A short vertical connector between rows of the diagram. */
function Rail() {
  return <span aria-hidden="true" className="mx-auto block h-5 w-px bg-border-strong" />;
}

export function Architecture() {
  const [selected, setSelected] = useState<NodeKey>("context");
  const detail = NODE_DETAIL[selected];

  return (
    <Section id="architecture" className="scroll-mt-24 bg-surface/30">
      <div className="max-w-2xl">
        <Eyebrow>Architecture</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Where it sits inside WHMCS
        </h2>
        <p className="mt-4 text-text-secondary">
          Eleven hooks, three surfaces, one line item. Select any part of the path to see what is
          actually behind it.
        </p>
      </div>

      <Reveal className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <p className="text-center font-mono text-xs uppercase tracking-wide text-text-muted">
            WHMCS
          </p>
          <Rail />

          <div className="grid grid-cols-3 gap-2">
            <Node id="invoice" label="Invoice" selected={selected === "invoice"} onSelect={setSelected} />
            <Node id="cart" label="Cart" selected={selected === "cart"} onSelect={setSelected} />
            <Node id="client" label="Client area" selected={selected === "client"} onSelect={setSelected} />
          </div>

          <Rail />
          <p className="rounded-xl border border-border-strong bg-bg py-2.5 text-center text-sm font-semibold text-text-primary">
            Gateway Fees &amp; Allocator
          </p>
          <Rail />

          <div className="grid grid-cols-3 gap-2">
            <Node id="context" label="Context" selected={selected === "context"} onSelect={setSelected} />
            <Node id="rules" label="Rules" selected={selected === "rules"} onSelect={setSelected} />
            <Node id="calculator" label="Calculator" selected={selected === "calculator"} onSelect={setSelected} />
          </div>

          <Rail />
          <Node id="allocator" label="Allocator" selected={selected === "allocator"} onSelect={setSelected} />
          <Rail />
          <Node id="charge" label="One invoice line item" selected={selected === "charge"} onSelect={setSelected} />
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-base font-semibold text-text-primary">{detail.title}</h3>
            <p className="mt-2 text-sm text-text-secondary">{detail.body}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {detail.refs.map((ref) => (
                <li
                  key={ref}
                  className="rounded-full border border-border px-3 py-1 font-mono text-xs text-text-muted"
                >
                  {ref}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-base font-semibold text-text-primary">
              {hooks.length} hooks, {adminPages.filter((page) => page.inNav).length} admin tabs
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              Each hook is wrapped individually, so a failure in one is reported and contained
              rather than taking a page down with it. The schema migrates itself on activation.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {adminPages
                .filter((page) => page.inNav)
                .map((page) => (
                  <li key={page.name} className="rounded-xl border border-border bg-surface-raised px-3 py-2">
                    <p className="text-sm font-medium text-text-primary">{page.name}</p>
                    <p className="mt-0.5 text-xs text-text-muted">{page.detail}</p>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
