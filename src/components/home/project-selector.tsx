"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

type Choice = {
  label: string;
  headline: string;
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  /** Honest availability note, shown verbatim when present. */
  note?: string;
};

/**
 * "What are you building?" — the conversion router. One question, seven
 * honest answers, each pointing at the exact page that serves it. HOST
 * options route to purchasable products; BUILD options route to service
 * pages and their enquiry forms. No invented pricing anywhere.
 */
const CHOICES: Choice[] = [
  {
    label: "Website",
    headline: "A website, designed and built for you.",
    body: "Business sites, portfolios, and landing pages — designed, built, and launched on our own hosting. You get one team for design, code, domain, and deployment.",
    primary: { label: "Start a web project", href: "/web-development" },
    secondary: { label: "Prefer DIY? Get hosting", href: "/hosting" },
  },
  {
    label: "Web App",
    headline: "A product with accounts, dashboards, and logic.",
    body: "When it's more than pages — logins, data, workflows — it's a web application. We design the flows, build the frontend and API, and run the infrastructure underneath.",
    primary: { label: "Scope a web app", href: "/web-development" },
    secondary: { label: "Building SaaS?", href: "/saas-development" },
  },
  {
    label: "Mobile App",
    headline: "Android, iOS, or both — with the backend included.",
    body: "Apps need servers, APIs, authentication, and updates. We build the whole path from idea to installed, and the backend lives on infrastructure we operate.",
    primary: { label: "Build my app", href: "/app-development" },
    secondary: { label: "See the process", href: "/app-development" },
  },
  {
    label: "E-commerce",
    headline: "A store that stays fast on sale day.",
    body: "WooCommerce or custom storefronts with payments, shipping, and GST-ready invoicing — built on hosting tuned for exactly this workload.",
    primary: { label: "Start my store", href: "/ecommerce-development" },
    secondary: { label: "WooCommerce hosting", href: "/wordpress-hosting" },
  },
  {
    label: "SaaS",
    headline: "From MVP to product people pay for.",
    body: "Scope the smallest version that proves the idea, wire billing from day one, and grow on infrastructure that scales past the demo — with one team on both sides.",
    primary: { label: "Scope my SaaS", href: "/saas-development" },
    secondary: { label: "Custom software instead?", href: "/custom-software" },
  },
  {
    label: "Hosting",
    headline: "Ready today — pick a plan, be live in minutes.",
    body: "LiteSpeed servers, NVMe storage, free SSL, daily backups, and free migration. Same price on renewal as on day one — that's the whole point.",
    primary: { label: "View hosting plans", href: "/hosting" },
    secondary: { label: "Search a domain", href: "/domains" },
  },
  {
    label: "VPS",
    headline: "Dedicated resources, root access — launching soon.",
    body: "VPS hosting is in the works and not purchasable yet. The VPS page shows what's coming; until then, most workloads run happily on our shared plans.",
    primary: { label: "See what's coming", href: "/vps" },
    secondary: { label: "Start on shared hosting", href: "/hosting" },
    note: "VPS is coming soon — no fake waitlist pressure, it'll be announced when it's real.",
  },
];

export function ProjectSelector() {
  const [active, setActive] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const choice = CHOICES[active];

  return (
    <Reveal className="mx-auto max-w-4xl">
      <div className="text-center">
        {/* "next" also keeps this distinct from the Hosting Advisor quiz,
            which asks "What are you building?" higher on the same page. */}
        <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          What are you building next?
        </h2>
        <p className="mt-4 text-text-secondary">
          Pick one — we&apos;ll point you at exactly the right place.
        </p>
      </div>

      {/* Plain toggle buttons, not ARIA tabs: the tabs pattern requires
          arrow-key management; aria-pressed buttons are natively keyboard-
          complete and announce state correctly. */}
      <div
        role="group"
        aria-label="Project type"
        className="mt-10 flex flex-wrap items-center justify-center gap-2.5"
      >
        {CHOICES.map((c, i) => (
          <button
            key={c.label}
            type="button"
            aria-pressed={i === active}
            onClick={() => setActive(i)}
            className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-brand-purple ${
              i === active
                ? "border-brand-purple bg-brand-purple/10 text-brand-purple-text"
                : "border-border bg-card text-text-secondary hover:border-border-strong hover:text-text-primary"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="relative mt-8 min-h-[220px] sm:min-h-[190px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={choice.label}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            transition={{ duration: reducedMotion ? 0 : 0.22, ease: "easeOut" }}
            className="rounded-3xl border border-border bg-card p-7 text-center sm:p-9"
          >
            <h3 className="text-xl font-semibold text-text-primary sm:text-2xl">
              {choice.headline}
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
              {choice.body}
            </p>
            {choice.note && <p className="mt-3 text-xs text-text-muted">{choice.note}</p>}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button href={choice.primary.href} size="lg">
                {choice.primary.label}
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
              <Button href={choice.secondary.href} variant="secondary" size="md">
                {choice.secondary.label}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Reveal>
  );
}
