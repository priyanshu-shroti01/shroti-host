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

/** Converts an INR base price to the target currency and rounds to a clean display value. */
export function convertFromInr(amountInr: number, code: CurrencyCode): number {
  if (code === "INR") return amountInr;
  const converted = amountInr * getCurrency(code).rateFromInr;
  return Math.round(converted);
}

export function formatPrice(amountInr: number, code: CurrencyCode): string {
  const value = convertFromInr(amountInr, code);
  return `${getCurrency(code).symbol}${value.toLocaleString("en-US")}`;
}
