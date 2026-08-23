"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Thin progress bar under the header that appears the moment an internal link
 * is clicked and completes when the route actually changes. With the server
 * in Frankfurt and most visitors in India, a menu click can take 300–600 ms
 * before anything visible happens; this is the feedback for that gap (the
 * old route-level loading.tsx was removed because it hid every page's
 * content behind a loader in the prerendered HTML).
 */
const SAFETY_MS = 8000;

function isInternalNavigation(e: MouseEvent): boolean {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  const anchor = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return false;
  let url: URL;
  try {
    url = new URL(anchor.href, location.href);
  } catch {
    return false;
  }
  if (url.origin !== location.origin) return false;
  // Same page (hash/anchor/query-only) navigations don't load a route.
  return url.pathname !== location.pathname;
}

export function NavigationProgress() {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!isInternalNavigation(e)) return;
      setPending(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setPending(false), SAFETY_MS);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Route changed (or the user navigated back): done.
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    const id = window.setTimeout(() => setPending(false), 150);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className={`nav-progress pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 ${pending ? "nav-progress--active" : ""}`}
    >
      <div className="nav-progress__bar h-full bg-[image:var(--gradient-hero)]" />
    </div>
  );
}
