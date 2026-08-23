"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { Check, Copy, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { homepagePromo } from "@/lib/promo";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const OPEN_DELAY_MS = 20000;
/** Below this viewport width the announcement bar + sticky CTA + chat FAB
 *  already compete for a first-time visitor's attention — no modal on top. */
const MIN_VIEWPORT_PX = 768;

/**
 * Once-per-campaign welcome offer dialog — the RankHostZone welcome-popup
 * pattern, restrained to this site's voice: the real, active promo from
 * `lib/promo.ts` (never an invented discount), one appearance per browser
 * per campaign id (a new promo id naturally re-shows once), and a fully
 * keyboard-operable dialog (ESC, backdrop, focus trapped inside while open).
 *
 * Fires after 20 s of engagement, and only on viewports ≥ 768 px that are
 * not already showing the mobile sticky CTA (`has-mobile-cta` on <body>).
 * The chatbot's 6 s greeting nudge fires first; it defers while this
 * dialog is open (`has-welcome-offer`), so the two never stack.
 *
 * Layout-chunk component: LazyMotion + `m` keep framer's full feature set
 * out of every route's first load.
 */
export function WelcomeOffer() {
  const promo = homepagePromo;
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const storageKey = `welcome-offer-${promo.id}-seen`;

  useEffect(() => {
    if (!promo.active || promo.kind !== "promo") return;
    // localStorage (not sessionStorage): a dismissal holds across visits, so
    // returning visitors aren't re-interrupted every session for the same
    // campaign. If storage is unavailable, skip the popup rather than nag on
    // every page view.
    try {
      if (localStorage.getItem(storageKey)) return;
    } catch {
      return;
    }
    const timer = setTimeout(() => {
      // Decided at fire time, not mount: the sticky CTA appears on scroll.
      if (
        window.innerWidth < MIN_VIEWPORT_PX ||
        document.body.classList.contains("has-mobile-cta")
      ) {
        return; // not marked seen — a later desktop visit may still get it once
      }
      try {
        localStorage.setItem(storageKey, "1");
      } catch {
        // Storage write failed — still show it this once.
      }
      setOpen(true);
    }, OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, [promo.active, promo.kind, storageKey]);

  // True modal (backdrop + focus trap), so the body scroll lock is justified.
  // Initial focus moves in on open; focus returns to wherever it was and the
  // lock is released on close AND on unmount (cleanup runs for both). The
  // body class lets the chatbot defer its greeting nudge until this dialog
  // is gone (see chatbot-widget).
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    document.body.classList.add("has-welcome-offer");
    dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("has-welcome-offer");
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      close();
      return;
    }
    if (e.key !== "Tab") return;
    // Minimal focus trap: cycle within the dialog's focusable elements.
    const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables || focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  async function copyCode() {
    if (!promo.code) return;
    try {
      await navigator.clipboard.writeText(promo.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the code is still visible to copy by hand.
    }
  }

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4"
            onClick={close}
          >
            <m.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="welcome-offer-title"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={onKeyDown}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-bg shadow-2xl"
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-40"
                style={{ background: "var(--gradient-glow)" }}
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close offer"
                className="absolute right-2 top-2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface hover:text-text-primary"
              >
                <X size={16} aria-hidden="true" />
              </button>

              <div className="relative px-7 pb-7 pt-9 text-center sm:px-9">
                <span className="inline-flex items-center gap-2 rounded-full border-2 border-brand-purple/30 bg-brand-purple/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-purple-text">
                  <Tag size={13} aria-hidden="true" />
                  Welcome offer
                </span>
                <h2 id="welcome-offer-title" className="mt-4 text-3xl font-extrabold tracking-tight text-text-primary">
                  {promo.discountLabel}{" "}
                  <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
                    your first term
                  </span>
                </h2>
                <p className="mt-3 text-sm text-text-secondary">{promo.message}</p>

                {promo.code && (
                  <div className="mt-6 flex items-center justify-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-border-strong bg-surface px-4 py-2.5">
                      <span className="text-xs text-text-muted">Code</span>
                      <code className="font-mono text-sm font-bold text-text-primary">{promo.code}</code>
                    </span>
                    <Button type="button" variant="secondary" size="md" onClick={copyCode} aria-live="polite">
                      {copied ? (
                        <>
                          <Check size={15} className="text-success" aria-hidden="true" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={15} aria-hidden="true" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                )}

                <div className="mt-7 flex flex-col gap-2.5">
                  {/* White text on gradient: the WCAG-safe deep gradient when the
                      token exists, brand gradient otherwise. Inline style so it
                      reliably overrides the Button's own background-image. */}
                  <Button
                    href={promo.href}
                    size="lg"
                    className="w-full"
                    style={{ backgroundImage: "var(--gradient-hero-deep, var(--gradient-hero))" }}
                    data-autofocus
                  >
                    Claim {promo.discountLabel}
                  </Button>
                  <button
                    type="button"
                    onClick={close}
                    className="py-2 text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
                  >
                    No thanks, maybe later
                  </button>
                </div>

                <p className="mt-4 text-xs text-text-muted">New customers only · Applied at checkout</p>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
