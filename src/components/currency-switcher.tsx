"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { currencies } from "@/lib/currency";
import { useCurrency } from "@/components/currency-provider";

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-sm font-medium text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
      >
        <Globe size={14} aria-hidden="true" />
        {currency}
        <ChevronDown size={12} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full z-10 mt-2 w-44 rounded-xl border border-border bg-surface-raised p-1 shadow-xl"
        >
          {currencies.map((c) => (
            <button
              key={c.code}
              type="button"
              role="option"
              aria-selected={currency === c.code}
              onClick={() => {
                setCurrency(c.code);
                setOpen(false);
              }}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-surface ${
                currency === c.code ? "text-brand-purple" : "text-text-primary"
              }`}
            >
              {c.symbol} {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
