"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { Magnetic } from "@/components/ui/magnetic";
import { useCurrency } from "@/components/currency-provider";
import { popularDomains } from "@/lib/domains";

const WHMCS_CART_URL = "https://portal.shrotihost.in/cart.php";

export function DomainSearch() {
  const [query, setQuery] = useState("");
  const [checking, setChecking] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { format } = useCurrency();

  const cleanQuery = query.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  const base = cleanQuery.includes(".") ? cleanQuery.split(".")[0] : cleanQuery;

  function handleSubmit(e: React.FormEvent) {
    if (checking) return;
    e.preventDefault();
    setChecking(true);
    setTimeout(() => formRef.current?.submit(), 650);
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border-strong bg-gradient-to-b from-surface to-bg px-6 py-20 sm:px-12 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-brand-purple/20 blur-[100px]"
        aria-hidden="true"
      />

      <Reveal className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <Badge tone="purple">Domains</Badge>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            Your name. Your domain.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-text-secondary">
            Real pricing. Register in minutes.
          </p>
        </div>

        <form
          ref={formRef}
          action={WHMCS_CART_URL}
          method="GET"
          onSubmit={handleSubmit}
          className="mx-auto mt-12 flex max-w-2xl flex-col gap-3 sm:flex-row"
        >
          <input type="hidden" name="a" value="add" />
          <input type="hidden" name="domain" value="register" />
          <div className="relative flex-1">
            <Search
              size={20}
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            />
            <input
              type="text"
              name="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="yourbrandname.com"
              aria-label="Search for a domain"
              style={{ caretColor: "var(--color-brand-purple)" }}
              className="h-16 w-full rounded-full border border-border-strong bg-card pl-14 pr-4 text-base text-text-primary placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-brand-purple sm:text-lg"
            />
          </div>
          <Magnetic>
            <Button type="submit" size="lg" className="h-16 w-44 px-8 text-base">
              {checking ? (
                <>
                  <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                  Checking…
                </>
              ) : (
                "Search Domain"
              )}
            </Button>
          </Magnetic>
        </form>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8"
        >
          {popularDomains.map((d) => (
            <motion.a
              key={d.tld}
              href={`${WHMCS_CART_URL}?a=add&domain=register&query=${encodeURIComponent((base || "yourbrand") + d.tld)}`}
              aria-label={`Register a ${d.tld} domain`}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.33, 1, 0.68, 1] } },
              }}
              className="group flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card px-3 py-5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-brand-purple hover:shadow-lg"
            >
              <span className="text-lg font-semibold text-text-primary">{d.tld}</span>
              <span className="text-xs text-text-muted">{format(d.registerInr)}/yr</span>
            </motion.a>
          ))}
        </motion.div>

        <div className="mt-10 text-center">
          <a
            href="https://portal.shrotihost.in/index.php/domain/pricing"
            className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-brand-purple hover:underline"
          >
            View full domain pricing
            <ArrowRight size={14} className="transition-transform duration-200 group-hover/link:translate-x-1" aria-hidden="true" />
          </a>
          <span className="mx-3 text-text-muted">·</span>
          <a
            href={`${WHMCS_CART_URL}?a=add&domain=transfer`}
            className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-brand-purple hover:underline"
          >
            Transfer your domain
            <ArrowRight size={14} className="transition-transform duration-200 group-hover/link:translate-x-1" aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </div>
  );
}
