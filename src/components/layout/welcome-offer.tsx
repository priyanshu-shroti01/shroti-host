"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { homepagePromo } from "@/lib/promo";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const OPEN_DELAY_MS = 2500;

/**
 * Session-once welcome offer dialog — the RankHostZone welcome-popup
 * pattern, restrained to this site's voice: the real, active promo from
 * `lib/promo.ts` (never an invented discount), one appearance per browser
 * session, and a fully keyboard-operable dialog (ESC, backdrop, focus
 * trapped inside while open).
 *
 * Fires at 2.5s, deliberately before the chatbot's 6s greeting nudge so the
 * two never appear at once.
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
    if (sessionStorage.getItem(storageKey)) return;
    const timer = setTimeout(() => {
      sessionStorage.setItem(storageKey, "1");
      setOpen(true);
    }, OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, [promo.active, promo.kind, storageKey]);

  // Scroll lock + initial focus while open. The body class lets the chatbot
  // defer its greeting nudge until this dialog is gone (see chatbot-widget).
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    document.body.classList.add("has-welcome-offer");
    dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("has-welcome-offer");
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
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4"
          onClick={close}
        >
          <motion.div
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
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface hover:text-text-primary"
            >
              <X size={16} aria-hidden="true" />
            </button>

            <div className="relative px-7 pb-7 pt-9 text-center sm:px-9">
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-brand-purple/30 bg-brand-purple/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-purple">
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
                  <Button type="button" variant="secondary" size="md" onClick={copyCode}>
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
                <Button href={promo.href} size="lg" className="w-full" data-autofocus>
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
