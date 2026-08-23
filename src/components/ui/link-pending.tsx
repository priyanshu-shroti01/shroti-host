"use client";

import { useLinkStatus } from "next/link";
import { Loader2 } from "lucide-react";

/**
 * Spinner that appears inside a next/link while its navigation is pending
 * (Next 16 `useLinkStatus`). Gives an immediate response on the tapped item
 * itself — the old page stays visible until the new route resolves, so
 * without this a slow round trip looks like a dead tap.
 */
export function LinkPending({ className = "" }: { className?: string }) {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return <Loader2 size={14} className={`shrink-0 animate-spin ${className}`} aria-hidden="true" />;
}
