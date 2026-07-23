"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eyebrow } from "@/components/ui/section";
import { useCurrency } from "@/components/currency-provider";
import { domainCategories, popularDomains, type DomainCategory } from "@/lib/domains";

const WHMCS_CART_URL = "https://portal.shrotihost.in/cart.php";

export function ExtensionGrid() {
  const [category, setCategory] = useState<DomainCategory>("Popular");
  const { format } = useCurrency();
  const filtered = popularDomains.filter((d) => d.category === category);

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>Extensions</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Pick an extension that fits.
        </h2>
        <p className="mt-4 text-text-secondary">
          Register price and renewal price, both shown upfront — hover a card to compare.
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <div className="inline-flex flex-wrap justify-center gap-1 rounded-full border border-border p-1">
          {domainCategories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                category === c ? "bg-brand-purple text-white" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        key={category}
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
      >
        {filtered.map((d) => (
          <motion.a
            key={d.tld}
            href={`${WHMCS_CART_URL}?a=add&domain=register&query=${encodeURIComponent("yourbrand" + d.tld)}`}
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] } },
            }}
            className="group relative flex flex-col items-center gap-1.5 overflow-hidden rounded-2xl border border-border bg-card px-3 py-6 text-center transition-all duration-200 hover:-translate-y-1 hover:border-brand-purple hover:shadow-lg"
          >
            <span className="text-xl font-semibold text-text-primary">{d.tld}</span>
            <span className="text-sm text-text-secondary">{format(d.registerInr)}/yr</span>

            <div className="grid grid-rows-[0fr] transition-all duration-300 ease-out group-hover:grid-rows-[1fr]">
              <div className="overflow-hidden">
                <span className="mt-1 block text-xs text-text-muted">
                  Renews {format(d.renewInr)}/yr
                </span>
              </div>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}
