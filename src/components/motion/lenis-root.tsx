"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Site-wide smoothed native scroll (Lenis), wired into GSAP's ticker so the
 * whole site runs one animation loop: Lenis owns scroll physics, GSAP's
 * ticker drives Lenis, and every ScrollTrigger updates from Lenis's scroll
 * events (the official integration — see docs/motion-system.md).
 *
 * Reduced motion: Lenis's `respectReducedMotion` (default true) forces 1:1
 * input with no easing and instant scrollTo/anchor jumps, live-updating with
 * the OS setting — the instance keeps running so scroll-linked WebGL stays
 * in sync without a separate code path.
 */

let lenisInstance: Lenis | null = null;

/** The live Lenis instance, for programmatic scrolls outside this module
 *  (falls back to null before mount / after unmount — callers should fall
 *  back to native scrollIntoView). */
export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function LenisRoot() {
  const pathname = usePathname();
  const firstRender = useRef(true);
  const cameFromPopstate = useRef(false);

  useEffect(() => {
    const lenis = new Lenis({
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

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // Lenis's `anchors` scrolls to the target but never moves focus; keyboard
  // users (and the #main skip link) need focus to land with the scroll
  // (docs/scroll-choreography.md accessibility contract, rule 5).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
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

  // Next 16 no longer resets scroll around App Router transitions
  // (no data-scroll-behavior opt-in on <html>), so with Lenis owning scroll
  // a push navigation would land mid-page. Reset to top on route change —
  // but never on back/forward (the browser restores position) and never
  // when navigating to a #hash.
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
