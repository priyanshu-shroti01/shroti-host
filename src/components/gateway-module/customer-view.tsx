import { Section, Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

/**
 * What the customer actually sees — the two real surfaces, and only those.
 *
 * Deliberately explicit about the asymmetry: the checkout previews and hides
 * gateways in the browser, while the invoice is where the module enforces
 * server-side. Overstating the checkout side would be the easiest lie on this
 * page to tell and the easiest for a technical buyer to catch.
 */

const MERGE_FIELDS = [
  "{gateway_name}",
  "{type}",
  "{percentage}",
  "{percentage_suffix}",
  "{amount}",
  "{amount_with_currency}",
  "{currency_symbol}",
  "{gateway_key}",
];

export function CustomerView() {
  return (
    <Section id="checkout" className="scroll-mt-24">
      <div className="max-w-2xl">
        <Eyebrow>At checkout</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          What the customer sees
        </h2>
        <p className="mt-4 text-text-secondary">
          Two surfaces, both using labels you write. Nothing appears anywhere else in the client
          area — no extra page, no menu item, no email.
        </p>
      </div>

      <Reveal className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
          <p className="border-b border-border px-6 py-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Order summary · checkout
          </p>
          <div className="px-6 py-5">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-secondary">Subtotal</dt>
                <dd className="font-mono tabular-nums text-text-secondary">₹3,098.00</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-secondary">Tax</dt>
                <dd className="font-mono tabular-nums text-text-secondary">₹557.64</dd>
              </div>
              <div className="flex justify-between rounded-xl bg-brand-purple/10 px-3 py-2">
                <dt className="text-text-primary">Gateway Fee @ 2.00%</dt>
                <dd className="font-mono tabular-nums text-brand-purple-text">+₹61.96</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-border pt-3">
                <dt className="font-semibold text-text-primary">Total</dt>
                <dd className="font-mono text-lg font-semibold tabular-nums text-text-primary">
                  ₹3,717.60
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-text-muted">
              Recalculated live as the customer switches payment method. Gateways your allocation
              rules exclude are hidden here in the browser; the invoice is where that is enforced.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
          <p className="border-b border-border px-6 py-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Invoice line item
          </p>
          <div className="px-6 py-5">
            <div className="flex items-baseline justify-between rounded-xl border border-border bg-surface-raised px-3 py-2.5">
              <span className="text-sm text-text-primary">Razorpay Gateway Fee @ 2.00%</span>
              <span className="font-mono text-sm tabular-nums text-text-secondary">₹61.96</span>
            </div>
            <p className="mt-4 text-sm text-text-secondary">
              An ordinary WHMCS line item — it prints on the PDF, exports with your billing data,
              and is marked internally so the module can always find its own row again. Whether it
              carries tax follows your setting and whether anything else on the invoice is taxed.
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-text-muted">
              Label merge fields
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {MERGE_FIELDS.map((field) => (
                <li
                  key={field}
                  className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-text-muted"
                >
                  {field}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
