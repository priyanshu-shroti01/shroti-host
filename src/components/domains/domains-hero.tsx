"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { suggestionVariants } from "@/lib/domains";

const WHMCS_CART_URL = "https://portal.shrotihost.in/cart.php";
const RECENT_KEY = "shrotihost:recent-domain-searches";
const MAX_RECENT = 5;

function sanitizeBase(raw: string): string {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/[^a-z0-9.-]/g, "");
  return cleaned.includes(".") ? cleaned.split(".")[0] : cleaned;
}

export function DomainsHero() {
  const [query, setQuery] = useState("");
  const [checking, setChecking] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      if (stored) setRecent(JSON.parse(stored));
    } catch {
      // localStorage unavailable — recent searches just won't persist
    }
  }, []);

  const base = sanitizeBase(query);
  const suggestions = base ? suggestionVariants.map((fn) => fn(base)) : [];

  function saveRecent(value: string) {
    try {
      const next = [value, ...recent.filter((r) => r !== value)].slice(0, MAX_RECENT);
      setRecent(next);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  function clearRecent() {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {
      // ignore
    }
  }

  function handleSubmit(e: React.FormEvent) {
    if (checking || !query.trim()) return;
    e.preventDefault();
    saveRecent(query.trim());
    setChecking(true);
    setTimeout(() => formRef.current?.submit(), 650);
  }

  function searchFor(value: string) {
    setQuery(value);
    inputRef.current?.focus();
  }

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-glow)" }}
        aria-hidden="true"
      />
      <Reveal className="relative mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
          Find your name.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">
          Search, compare extensions, and register — real pricing, no bait-and-switch renewals.
        </p>

        <form
          ref={formRef}
          action={WHMCS_CART_URL}
          method="GET"
          onSubmit={handleSubmit}
          className="relative mx-auto mt-10 max-w-2xl"
        >
          <input type="hidden" name="a" value="add" />
          <input type="hidden" name="domain" value="register" />
          <div className="relative">
            <Search
              size={22}
              className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              name="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for your domain…"
              aria-label="Search for a domain"
              autoComplete="off"
              style={{ caretColor: "var(--color-brand-purple)" }}
              className="h-18 w-full rounded-full border border-border-strong bg-card pl-16 pr-36 text-lg text-text-primary shadow-lg placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-brand-purple sm:text-xl"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Magnetic>
                <Button type="submit" size="lg" disabled={!query.trim()}>
                  {checking ? (
                    <>
                      <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                      Checking…
                    </>
                  ) : (
                    "Search"
                  )}
                </Button>
              </Magnetic>
            </div>
          </div>

          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-2xl border border-border-strong bg-card p-2 text-left shadow-2xl"
              >
                {suggestions.map((s, i) => (
                  <motion.a
                    key={s}
                    href={`${WHMCS_CART_URL}?a=add&domain=register&query=${encodeURIComponent(s)}`}
                    onClick={() => saveRecent(s)}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15, delay: i * 0.03 }}
                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-mono text-text-primary transition-colors hover:bg-surface"
                  >
                    <Search size={14} className="shrink-0 text-text-muted" aria-hidden="true" />
                    {s}
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {suggestions.length === 0 && recent.length > 0 && (
          <div className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted">
              <Clock size={13} aria-hidden="true" />
              Recent:
            </span>
            {recent.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => searchFor(r)}
                className="rounded-full border border-border px-3 py-1 font-mono text-xs text-text-secondary transition-colors hover:border-brand-purple hover:text-brand-purple"
              >
                {r}
              </button>
            ))}
            <button
              type="button"
              onClick={clearRecent}
              aria-label="Clear recent searches"
              className="inline-flex items-center text-text-muted hover:text-text-secondary"
            >
              <X size={13} aria-hidden="true" />
            </button>
          </div>
        )}
      </Reveal>
    </div>
  );
}
