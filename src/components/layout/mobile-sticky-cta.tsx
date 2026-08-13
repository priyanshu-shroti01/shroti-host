"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/components/currency-provider";
import { sharedPlans } from "@/lib/plans";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const SHOW_AFTER_PX = 520;
const DISMISS_KEY = "mobile-sticky-cta-dismissed";

/** Pages where a persistent "from ₹X/mo" pitch makes sense — plan-bearing pages only, never legal/contact/status. */
const PLAN_PAGES = new Set([
  "/",
  "/hosting",
  "/wordpress-hosting",
  "/unlimited-hosting",
  "/reseller-hosting",
  "/master-reseller-hosting",
  "/alpha-reseller-hosting",
  "/vps",
  "/domains",
]);

/**
 * Mobile-only sticky bottom CTA — the RankHostZone pattern, appearing only
 * after real scroll intent (one viewport down) and dismissible for the
 * session. While visible it sets `has-mobile-cta` on <body> so the chatbot
 * FAB shifts up instead of being covered (see chatbot-widget.tsx).
 */
export function MobileStickyCta() {
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();
  const { currency, convertDisplay } = useCurrency();
  const [scrolledEnough, setScrolledEnough] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolledEnough(window.scrollY > SHOW_AFTER_PX);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = PLAN_PAGES.has(pathname) && scrolledEnough && !dismissed;

  useEffect(() => {
    document.body.classList.toggle("has-mobile-cta", visible);
    return () => document.body.classList.remove("has-mobile-cta");
  }, [visible]);

  const currencySymbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : "€";
  const fromPrice = convertDisplay(sharedPlans[0].monthlyPrice);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reducedMotion ? { opacity: 0 } : { y: 72, opacity: 0 }}
          animate={reducedMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { y: 72, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border-strong bg-surface-raised/95 px-4 py-2.5 shadow-[0_-4px_20px_rgb(21_17_28/0.12)] backdrop-blur lg:hidden"
        >
          <div className="flex items-center justify-between gap-3 pr-14">
            <p className="min-w-0 text-sm font-semibold text-text-primary">
              Hosting from {currencySymbol}
              {Math.round(fromPrice).toLocaleString("en-US")}/mo
            </p>
            <Button href="/hosting#compare" size="sm" className="shrink-0">
              Get Started
            </Button>
          </div>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => {
              sessionStorage.setItem(DISMISS_KEY, "1");
              setDismissed(true);
            }}
            className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-text-muted hover:bg-surface hover:text-text-primary"
          >
            <X size={15} aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
