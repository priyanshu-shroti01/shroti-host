"use client";

import { useId } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { currencies } from "@/lib/currency";
import { useCurrency } from "@/components/currency-provider";

const APPROX_HINT = "Approx. conversion; billed in INR";

/**
 * Native <select> styled as the header pill — the browser supplies the
 * keyboard model (arrows, type-ahead, Escape) and valid ARIA for free.
 * Non-INR choices carry a tooltip + sr-only note that the figures are
 * approximate; checkout is always billed in INR.
 */
export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const hintId = useId();
  const approx = currency !== "INR";

  return (
    <div className="relative inline-flex items-center" title={approx ? APPROX_HINT : undefined}>
      <Globe size={14} aria-hidden="true" className="pointer-events-none absolute left-3 text-text-secondary" />
      <select
        aria-label="Currency"
        aria-describedby={approx ? hintId : undefined}
        value={currency}
        onChange={(e) => {
          const next = currencies.find((c) => c.code === e.target.value);
          if (next) setCurrency(next.code);
        }}
        className="h-9 cursor-pointer appearance-none rounded-full border border-border bg-bg pl-8 pr-7 text-sm font-medium text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
      >
        {currencies.map((c) => (
          <option key={c.code} value={c.code}>
            {c.symbol} {c.code}
          </option>
        ))}
      </select>
      <ChevronDown size={12} aria-hidden="true" className="pointer-events-none absolute right-2.5 text-text-secondary" />
      {approx && (
        <span id={hintId} className="sr-only">
          {APPROX_HINT}
        </span>
      )}
    </div>
  );
}
