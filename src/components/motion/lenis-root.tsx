"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";

/**
 * Site-wide smoothed native scroll (Lenis), wired into GSAP's ticker so the
 * whole site runs one animation loop: Lenis owns scroll physics, GSAP's
 * ticker drives Lenis, and every ScrollTrigger updates from Lenis's scroll
 * events (the official integration — see docs/motion-system.md).
 *
 * Performance contract (Lighthouse-verified): lenis + gsap are dynamically
 * imported AFTER idle so they never sit in the hydration critical path, and
 * only on fine-pointer devices — Lenis deliberately leaves touch scrolling
 * native (syncTouch is off for iOS stability), so on phones it would be
 * parse cost with zero scroll benefit. Without Lenis, Next's own
 * scroll-to-top on navigation still applies, so every fallback path keeps
 * working.
 *
 * Reduced motion: Lenis's `respectReducedMotion` (default true) forces 1:1
 * input with no easing and instant scrollTo/anchor jumps, live-updating with
 * the OS setting — the instance keeps running so scroll-linked WebGL stays
 * in sync without a separate code path.
 */

let lenisInstance: Lenis | null = null;

/** The live Lenis instance, for programmatic scrolls outside this module
 *  (null before idle init, on touch devices, and after unmount — callers
 *  must fall back to native scrolling). */
export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function LenisRoot() {
  const pathname = usePathname();
  const firstRender = useRef(true);
  const cameFromPopstate = useRef(false);

  useEffect(() => {
    // Touch devices keep native scroll — see the performance contract above.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let disposed = false;
    let cleanup: (() => void) | null = null;

    const start = async () => {
      const [{ default: LenisCtor }, { gsap, ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("@/lib/gsap"),
      ]);
      if (disposed) return;
      const lenis = new LenisCtor({
        // GSAP's ticker is the one raf loop — Lenis must not run its own.
        autoRaf: false,
        // Lenis intercepts in-page anchor links; without this they dead-end.
        anchors: true,
      });
      lenisInstance = lenis;
      lenis.on("scroll", () => ScrollTrigger.update());
      const raf = (time: number) => lenis.raf(time * 1000); // ticker: s → ms
      gsap.ticker.add(raf);
      // Without this, GSAP time-warps after a long frame and scrubs desync.
      gsap.ticker.lagSmoothing(0);
      cleanup = () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
        lenisInstance = null;
      };
    };

    // Init after idle so the ~150KB of scroll machinery parses after LCP.
    let idleId: number | undefined;
    let timerId: ReturnType<typeof setTimeout> | undefined;
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(() => void start(), { timeout: 2500 });
    } else {
      timerId = setTimeout(() => void start(), 1200);
    }
    return () => {
      disposed = true;
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timerId !== undefined) clearTimeout(timerId);
      cleanup?.();
    };
  }, []);

  // Lenis's `anchors` scrolls to the target but never moves focus; keyboard
  // users (and the #main skip link) need focus to land with the scroll
  // (docs/scroll-choreography.md accessibility contract, rule 5).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!lenisInstance) return; // native anchor behavior already moves focus
      const anchor = (e.target as HTMLElement).closest?.('a[href^="#"]');
      if (!anchor) return;
      const id = decodeURIComponent(anchor.getAttribute("href")!.slice(1));
      const el = id ? document.getElementById(id) : null;
      if (!el) return;
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // With Lenis active, its raf overwrites Next's own scroll-to-top on push
  // navigation, so reset manually — but never on back/forward (the browser
  // restores position) and never when navigating to a #hash. When Lenis is
  // not running (touch, pre-idle), lenisInstance is null and Next's native
  // behavior applies untouched.
  useEffect(() => {
    const onPop = () => {
      cameFromPopstate.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const wasPop = cameFromPopstate.current;
    cameFromPopstate.current = false;
    if (wasPop || window.location.hash) return;
    lenisInstance?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
