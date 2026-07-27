"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Clock, Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { useCurrency } from "@/components/currency-provider";

const WHMCS_CART_URL = "https://portal.shrotihost.in/cart.php";
const RECENT_KEY = "shrotihost:recent-domain-searches";
const MAX_RECENT = 5;
const DEBOUNCE_MS = 450;

type CheckResult = {
  domain: string;
  tld: string;
  available: boolean | null;
  priceInr: number | null;
};

type CheckResponse = {
  query: string;
  exact: CheckResult[];
  suggestions: CheckResult[];
};

function sanitizeQuery(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/[^a-z0-9.-]/g, "");
}

function ResultRow({ result, onNavigate }: { result: CheckResult; onNavigate: (domain: string) => void }) {
  const { format } = useCurrency();

  let status: React.ReactNode;
  let clickable = true;
  if (result.available === false) {
    status = <span className="text-text-muted">Taken</span>;
    clickable = false;
  } else if (result.priceInr !== null) {
    // Real price regardless of whether availability is confirmed (true) or
    // still unknown (null, e.g. a live check that failed/timed out) — the
    // price itself is always real data from our own catalog. Clicking still
    // routes to the real cart, which does its own authoritative check.
    status = <span className="font-semibold text-success">{format(result.priceInr)}/yr</span>;
  } else {
    status = <span className="text-text-muted">Not sold here</span>;
    clickable = false;
  }

  const rowClasses =
    "flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors";

  const content = (
    <>
      <span className="flex items-center gap-2.5 font-mono text-text-primary">
        {result.available === true ? (
          <Check size={14} className="shrink-0 text-success" aria-hidden="true" />
        ) : (
          <Search size={14} className="shrink-0 text-text-muted" aria-hidden="true" />
        )}
        {result.domain}
      </span>
      {status}
    </>
  );

  if (!clickable) {
    return <div className={`${rowClasses} opacity-70`}>{content}</div>;
  }

  return (
    <a
      href={`${WHMCS_CART_URL}?a=add&domain=register&query=${encodeURIComponent(result.domain)}`}
      onClick={() => onNavigate(result.domain)}
      className={`${rowClasses} hover:bg-surface`}
    >
      {content}
    </a>
  );
}

export function DomainsHero() {
  const [query, setQuery] = useState("");
  const [checking, setChecking] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [liveChecking, setLiveChecking] = useState(false);
  const [liveError, setLiveError] = useState(false);
  const [results, setResults] = useState<CheckResponse | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      // One-time environment read on mount, not a render-driven update.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setRecent(JSON.parse(stored));
    } catch {
      // localStorage unavailable — recent searches just won't persist
    }
  }, []);

  useEffect(() => {
    const clean = sanitizeQuery(query);
    if (!clean) return;

    const timer = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch(`/api/domain-check?q=${encodeURIComponent(clean)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("check failed");
        const data: CheckResponse = await res.json();
        if (data.query === clean) setResults(data);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setLiveError(true);
      } finally {
        if (abortRef.current === controller) setLiveChecking(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  function handleQueryChange(value: string) {
    setQuery(value);
    abortRef.current?.abort();

    const clean = sanitizeQuery(value);
    if (!clean) {
      setResults(null);
      setLiveChecking(false);
      setLiveError(false);
      return;
    }
    setLiveChecking(true);
    setLiveError(false);
  }

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
    handleQueryChange(value);
    inputRef.current?.focus();
  }

  const showDropdown = query.trim().length > 0;
  const hasResults = results && (results.exact.length > 0 || results.suggestions.length > 0);

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
              onChange={(e) => handleQueryChange(e.target.value)}
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
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 right-0 top-full z-10 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-border-strong bg-bg p-2 text-left shadow-2xl"
              >
                {liveChecking && !hasResults && (
                  <div className="flex items-center gap-2.5 px-4 py-3 text-sm text-text-muted">
                    <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                    Checking availability…
                  </div>
                )}

                {liveError && !hasResults && (
                  <div className="px-4 py-3 text-sm text-text-muted">
                    Live check unavailable right now — press Search to check at checkout.
                  </div>
                )}

                {results && results.exact.length > 0 && (
                  <div>
                    {results.exact.map((r) => (
                      <ResultRow key={r.domain} result={r} onNavigate={saveRecent} />
                    ))}
                  </div>
                )}

                {results && results.suggestions.length > 0 && (
                  <div className="mt-1 border-t border-border pt-1">
                    <p className="px-4 py-1.5 text-[11px] font-medium uppercase tracking-wide text-text-muted">
                      Suggested names
                    </p>
                    {results.suggestions.map((r) => (
                      <ResultRow key={r.domain} result={r} onNavigate={saveRecent} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {!showDropdown && recent.length > 0 && (
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
