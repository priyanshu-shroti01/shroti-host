export type CurrencyCode = "INR" | "USD" | "EUR";

export type CurrencyDef = {
  code: CurrencyCode;
  symbol: string;
  label: string;
  /** Approximate, fixed conversion rate from INR for marketing display only.
   *  Actual checkout currency and live rates are handled in WHMCS. */
  rateFromInr: number;
};

export const currencies: CurrencyDef[] = [
  { code: "INR", symbol: "₹", label: "INR — Indian Rupee", rateFromInr: 1 },
  { code: "USD", symbol: "$", label: "USD — US Dollar", rateFromInr: 1 / 83 },
  { code: "EUR", symbol: "€", label: "EUR — Euro", rateFromInr: 1 / 90 },
];

export function getCurrency(code: CurrencyCode): CurrencyDef {
  return currencies.find((c) => c.code === code) ?? currencies[0];
}

/**
 * Converts an INR base price to the target currency and rounds to a clean
 * display value. INR stays whole. Foreign amounts keep two decimals below 100
 * (₹39/mo is $0.47, never "$0") and round to whole units above that, where
 * cents are noise on a marketing page.
 */
export function convertFromInr(amountInr: number, code: CurrencyCode): number {
  if (code === "INR") return amountInr;
  const converted = amountInr * getCurrency(code).rateFromInr;
  return converted < 100 ? Math.round(converted * 100) / 100 : Math.round(converted);
}

export function formatPrice(amountInr: number, code: CurrencyCode): string {
  const value = convertFromInr(amountInr, code);
  const isWhole = Number.isInteger(value);
  return `${getCurrency(code).symbol}${value.toLocaleString("en-US", {
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}
