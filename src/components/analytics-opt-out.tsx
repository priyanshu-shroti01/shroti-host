"use client";

import { useSyncExternalStore } from "react";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

const KEY = "ga-opt-out";
const CHANGE_EVENT = "shrotihost:ga-opt-out";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function readOptOut(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Per-browser analytics switch referenced from the privacy policy. Sets the
 * official `ga-disable-<ID>` flag (honoured by gtag.js immediately) and
 * persists the choice; `app/layout.tsx` re-applies it before gtag loads.
 */
export function AnalyticsOptOut() {
  // null on the server / during hydration, then the stored preference.
  const optedOut = useSyncExternalStore<boolean | null>(subscribe, readOptOut, () => null);

  function toggle() {
    const next = !optedOut;
    try {
      if (next) localStorage.setItem(KEY, "1");
      else localStorage.removeItem(KEY);
    } catch {
      /* storage unavailable — still apply for this page */
    }
    (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = next;
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  return (
    <div
      className="mt-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
      role="group"
      aria-labelledby="analytics-choice"
    >
      <div>
        <p id="analytics-choice" className="text-sm font-semibold text-text-primary">
          Analytics in this browser
        </p>
        <p className="mt-1 text-sm text-text-secondary" role="status" aria-live="polite">
          {optedOut === null
            ? "Checking your preference…"
            : optedOut
              ? "Off — Google Analytics will not record your visits here."
              : "On — visits are measured in aggregate (IP anonymised)."}
        </p>
      </div>
      <button
        type="button"
        onClick={toggle}
        disabled={optedOut === null}
        aria-pressed={optedOut === true}
        className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-border-strong px-5 text-sm font-medium text-text-primary transition-colors hover:border-brand-purple disabled:opacity-50"
      >
        {optedOut ? "Turn analytics on" : "Turn analytics off"}
      </button>
    </div>
  );
}
