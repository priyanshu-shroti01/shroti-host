"use client";

import { useCurrency } from "@/components/currency-provider";
import { currencySymbols, pricing } from "@/lib/gateway-fees-module";

/**
 * Prices come from the WHMCS catalogue itself, per currency — not from the
 * site's approximate INR conversion. What the page shows is what checkout
 * charges, in whichever currency the visitor has selected.
 */
export function useModulePrice() {
  const { currency } = useCurrency();
  const format = (amount: number) =>
    `${currencySymbols[currency]}${amount.toLocaleString("en-US", {
      minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
      maximumFractionDigits: 2,
    })}`;
  const tiers = pricing.map((tier) => ({ ...tier, amount: tier.amounts[currency] }));
  return { currency, format, tiers, monthly: tiers[0] };
}

export function MonthlyPrice({ className = "" }: { className?: string }) {
  const { format, monthly } = useModulePrice();
  return <span className={className}>{format(monthly.amount)}/mo</span>;
}
