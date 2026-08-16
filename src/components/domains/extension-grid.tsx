"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Eyebrow } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/components/currency-provider";
import { allDomains, domainCategories, type DomainCategory, type DomainPrice } from "@/lib/domains";

const WHMCS_CART_URL = "https://portal.shrotihost.in/cart.php";
const badgeTone = { "Hot!": "purple", "Sale!": "success", "New!": "blue" } as const;

export function ExtensionGrid({ domains = allDomains }: { domains?: DomainPrice[] }) {
  const [category, setCategory] = useState<DomainCategory | "All">("All");
  const [query, setQuery] = useState("");
  const { format } = useCurrency();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\./, "");
    return domains.filter((d) => {
      const matchesCategory = category === "All" || d.category === category;
      const matchesQuery = !q || d.tld.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [domains, category, query]);

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>All {domains.length} extensions</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Every extension we sell, priced upfront.
        </h2>
        <p className="mt-4 text-text-secondary">
          Register price and renewal price, both shown upfront — hover a card to compare.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-md">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter extensions, e.g. shop"
            aria-label="Filter extensions"
            style={{ caretColor: "var(--color-brand-purple)" }}
            className="h-11 w-full rounded-full border border-border-strong bg-card pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-brand-purple"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="inline-flex max-w-full flex-wrap justify-center gap-1 rounded-2xl border border-border p-1">
          {(["All", ...domainCategories] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                category === c ? "bg-brand-purple text-white" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-sm text-text-muted">
          No extensions match &ldquo;{query}&rdquo;. Try a different search or category.
        </p>
      ) : (
        <motion.div
          key={category + query}
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.02 } } }}
          className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
        >
          {filtered.map((d) => (
            <motion.a
              key={d.tld}
              href={`${WHMCS_CART_URL}?a=add&domain=register&query=${encodeURIComponent("yourbrand" + d.tld)}`}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.33, 1, 0.68, 1] } },
              }}
              className="group relative flex flex-col items-center gap-1.5 overflow-hidden rounded-2xl border border-border bg-card px-3 py-6 text-center transition-all duration-200 hover:-translate-y-1 hover:border-brand-purple hover:shadow-lg"
            >
              {d.badge && (
                <Badge tone={badgeTone[d.badge]} className="absolute right-2 top-2 px-1.5 py-0.5 text-[10px]">
                  {d.badge}
                </Badge>
              )}
              <span className="text-xl font-semibold text-text-primary">{d.tld}</span>
              <span className="text-sm text-text-secondary">
                {format(d.registerInr)}/{d.termYears === 2 ? "2yr" : "yr"}
              </span>

              <div className="grid grid-rows-[0fr] transition-all duration-300 ease-out group-hover:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <span className="mt-1 block text-xs text-text-muted">
                    Renews {format(d.renewInr)}/{d.termYears === 2 ? "2yr" : "yr"}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      )}
    </div>
  );
}
