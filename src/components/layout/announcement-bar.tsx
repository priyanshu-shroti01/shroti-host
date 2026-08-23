"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Clock, Copy, GraduationCap, Percent, Tag, X } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { homepagePromo, type PromoBannerConfig, type PromoIcon } from "@/lib/promo";

const icons: Record<PromoIcon, typeof GraduationCap> = {
  "graduation-cap": GraduationCap,
  tag: Tag,
  percent: Percent,
  clock: Clock,
};

function PromoCountdown({ target }: { target: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    if (reducedMotion) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [reducedMotion]);

  if (now === null) return null;

  const remainingMs = new Date(target).getTime() - now;
  if (remainingMs <= 0) return null;

  if (reducedMotion) {
    return (
      <span className="text-xs text-white/90">
        Offer ends {new Date(target).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
      </span>
    );
  }

  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <span
      className="font-mono text-xs text-white/90"
      aria-label={`Offer ends in ${hours} hours ${minutes} minutes`}
    >
      {pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </span>
  );
}

/** Session dismissal lives in sessionStorage; every access is guarded
 *  because Safari private mode / blocked storage throws on read AND write. */
function readDismissed(key: string): boolean {
  try {
    return sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function writeDismissed(key: string) {
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    // Storage unavailable — the bar still hides for this page view.
  }
}

export function AnnouncementBar({ promo = homepagePromo }: { promo?: PromoBannerConfig }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const dismissKey = `announcement-${promo.id}-dismissed`;

  async function copyCode() {
    if (!promo.code) return;
    try {
      await navigator.clipboard.writeText(promo.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the code stays visible to copy by hand.
    }
  }

  useEffect(() => {
    if (!promo.active) return;
    if (!readDismissed(dismissKey)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }
  }, [promo.active, dismissKey]);

  if (!promo.active || !visible) return null;

  const Icon = promo.icon ? icons[promo.icon] : null;
  const isPromo = promo.kind === "promo";

  return (
    <div
      className={`relative flex min-h-11 flex-wrap items-center justify-center gap-x-3 gap-y-1 py-1 pl-4 pr-14 text-center text-sm font-medium text-white ${
        // Text sits on this gradient, so use the WCAG-safe deep variant when
        // the token exists and fall back to the brand gradient otherwise.
        isPromo ? "bg-[image:var(--gradient-hero-deep,var(--gradient-hero))]" : "bg-brand-purple"
      }`}
    >
      {Icon && <Icon size={16} className="hidden shrink-0 sm:block" aria-hidden="true" />}
      <Link href={promo.href} className="inline-block py-1.5 underline-offset-2 hover:underline">
        {promo.message}
      </Link>
      {promo.discountLabel && (
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
          {promo.discountLabel}
        </span>
      )}
      {promo.code && (
        /* 44px hit area (min-h-11) around a visually small pill. */
        <button
          type="button"
          onClick={copyCode}
          aria-label={copied ? "Promo code copied" : `Copy promo code ${promo.code}`}
          className="group/code inline-flex min-h-11 min-w-11 items-center px-1"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-2.5 py-0.5 text-xs transition-colors group-hover/code:border-white/60 group-hover/code:bg-white/10">
            <span className="text-white/90">Code</span>
            <code className="font-mono font-semibold">{promo.code}</code>
            {copied ? (
              <Check size={12} aria-hidden="true" />
            ) : (
              <Copy size={12} className="text-white/90" aria-hidden="true" />
            )}
          </span>
        </button>
      )}
      {promo.expiresAt && <PromoCountdown target={promo.expiresAt} />}
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => {
          writeDismissed(dismissKey);
          setVisible(false);
        }}
        className="absolute right-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white/80 hover:bg-white/15 hover:text-white"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
