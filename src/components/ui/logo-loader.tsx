"use client";

import { useEffect, useState } from "react";
import { LogoMark, MARK_CLOUD, MARK_RIBBON, MARK_VIEWBOX } from "@/components/ui/logo-mark";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const DEFAULT_STAGES = ["Resolving", "Connecting", "Rendering"];

/**
 * The ShrotiHost loader: a brand-blue request packet rides the infinity
 * ribbon of the mark — the same "request moving through infrastructure"
 * motif as the 3D stack — while a stage readout narrates the wait
 * (docs/motion-system.md: loading is a timeline with named stages, not a
 * spinner). The packet moves via CSS offset-path on the ribbon outline.
 *
 * Reduced motion: static mark + the final stage label, no animation.
 */
export function LogoLoader({
  stages = DEFAULT_STAGES,
  stageMs = 700,
  size = 96,
  label = "Loading",
  className = "",
}: {
  stages?: string[];
  stageMs?: number;
  size?: number;
  label?: string;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (reducedMotion || stages.length < 2) return;
    const id = setInterval(() => setStage((s) => (s + 1) % stages.length), stageMs);
    return () => clearInterval(id);
  }, [reducedMotion, stages.length, stageMs]);

  const h = Math.round(size * (23 / 39));

  return (
    <div role="status" aria-live="polite" aria-label={label} className={`inline-flex flex-col items-center gap-4 ${className}`}>
      <div className="relative text-brand-purple" style={{ width: size, height: h }}>
        {reducedMotion ? (
          <LogoMark className="h-full w-full" />
        ) : (
          <svg viewBox={MARK_VIEWBOX} className="h-full w-full overflow-visible" aria-hidden="true">
            <path d={MARK_CLOUD} fill="currentColor" opacity={0.35} />
            <path d={MARK_RIBBON} fill="currentColor" />
            <circle
              r="1.1"
              className="logo-packet fill-brand-blue"
              style={{ offsetPath: `path("${MARK_RIBBON}")`, filter: "drop-shadow(0 0 2px var(--color-brand-blue))" }}
            />
          </svg>
        )}
      </div>

      {/* Named stage — the narration that makes this a timeline, not a spinner */}
      <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
        <span className="flex items-center gap-1" aria-hidden="true">
          {stages.map((s, i) => (
            <span key={s} className={`h-1 w-4 rounded-full transition-colors duration-300 ${i <= stage ? "bg-brand-purple" : "bg-border"}`} />
          ))}
        </span>
        <span className="min-w-[6ch]">{stages[reducedMotion ? stages.length - 1 : stage]}…</span>
      </div>
    </div>
  );
}
