"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

/**
 * Reports client-side route changes to GA4. The first page_view is sent by
 * the gtag `config` call in the root layout (`send_page_view: true`), so this
 * skips the pathname it mounted with and only fires on subsequent App Router
 * navigations — otherwise every landing would count twice.
 *
 * Renders nothing. Uses only `usePathname` (no `useSearchParams`) so every
 * page stays statically prerenderable without a Suspense boundary.
 */
export function Analytics() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (lastPath.current === null) {
      lastPath.current = pathname;
      return;
    }
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    trackEvent("page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  return null;
}
