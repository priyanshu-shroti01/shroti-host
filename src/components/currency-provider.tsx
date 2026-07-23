"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type CurrencyCode, convertFromInr, formatPrice } from "@/lib/currency";

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  format: (amountInr: number) => string;
  /** Converts an INR base amount to the selected currency's raw numeric value (no symbol). */
  convertDisplay: (amountInr: number) => number;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const STORAGE_KEY = "currency";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("INR");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "INR" || stored === "USD" || stored === "EUR") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrencyState(stored);
    }
  }, []);

  function setCurrency(code: CurrencyCode) {
    setCurrencyState(code);
    localStorage.setItem(STORAGE_KEY, code);
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        format: (amountInr) => formatPrice(amountInr, currency),
        convertDisplay: (amountInr) => convertFromInr(amountInr, currency),
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
