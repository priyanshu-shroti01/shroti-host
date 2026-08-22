"use client";

import { useEffect, useState } from "react";
import { LogoMark, MARK_CLOUD, MARK_RIBBON, MARK_VIEWBOX } from "@/components/ui/logo-mark";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

export type LoaderVariant = "packet" | "draw" | "shimmer" | "pulse";

const DEFAULT_STAGES = ["Resolving", "Connecting", "Rendering"];

/** Inline SVG mask of the mark for the shimmer variant — no extra asset request. */
const MARK_MASK = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEWBOX}"><path d="${MARK_CLOUD}" fill="black"/><path d="${MARK_RIBBON}" fill="black"/></svg>`,
)}")`;

/**
 * Logo-based loader. Per docs/motion-system.md ("Loading = timeline with
 * named stages, not a spinner") every variant pairs the animated mark with a
 * stage readout, so the wait is *narrated*, not just decorated.
 *
 *  packet  — (recommended) brand-blue request packet rides the infinity
 *            ribbon; the same packet motif as the 3D infra stack
 *  draw    — the outline draws itself, then fills with the brand gradient
 *  shimmer — gradient light sweeps across the solid mark
 *  pulse   — soft breathing glow on the mark
 *
 * Reduced motion: static mark + the stage label — no motion at all.
 */
export function LogoLoader({
  variant = "packet",
  stages = DEFAULT_STAGES,
  stageMs = 700,
  size = 96,
  label = "Loading",
  className = "",
}: {
  variant?: LoaderVariant;
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
  const gradId = `lg-${variant}`;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={`inline-flex flex-col items-center gap-4 ${className}`}
    >
      <div className="relative text-brand-purple" style={{ width: size, height: h }}>
        {reducedMotion ? (
          <LogoMark className="h-full w-full" />
        ) : variant === "packet" ? (
          <svg viewBox={MARK_VIEWBOX} className="h-full w-full overflow-visible" aria-hidden="true">
            <path d={MARK_CLOUD} fill="currentColor" opacity={0.35} />
            <path d={MARK_RIBBON} fill="currentColor" />
            {/* The packet: travels the ribbon's centreline. Using the ribbon
                outline itself as the motion path keeps it on-brand without
                hand-tracing a new curve. */}
            <circle r="1.1" className="fill-brand-blue" style={{ filter: "drop-shadow(0 0 2px var(--color-brand-blue))" }}>
              <animateMotion dur="2.4s" repeatCount="indefinite" rotate="auto" path={MARK_RIBBON} />
            </circle>
          </svg>
        ) : variant === "draw" ? (
          <svg viewBox={MARK_VIEWBOX} className="h-full w-full overflow-visible" aria-hidden="true">
            <defs>
              <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="var(--color-brand-purple)" />
                <stop offset="1" stopColor="var(--color-brand-blue)" />
              </linearGradient>
            </defs>
            {[MARK_CLOUD, MARK_RIBBON].map((d, i) => (
              <path
                key={i}
                d={d}
                fill={`url(#${gradId})`}
                stroke="currentColor"
                strokeWidth={0.5}
                pathLength={1}
                className="logo-draw"
                style={{ animationDelay: `${i * 0.35}s` }}
              />
            ))}
          </svg>
        ) : variant === "shimmer" ? (
          <div className="logo-shimmer h-full w-full" style={{ WebkitMaskImage: MARK_MASK, maskImage: MARK_MASK }} />
        ) : (
          <LogoMark className="logo-pulse h-full w-full" />
        )}
      </div>

      {/* Named stage — the narration that makes this a timeline, not a spinner */}
      <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
        <span className="flex items-center gap-1" aria-hidden="true">
          {stages.map((s, i) => (
            <span
              key={s}
              className={`h-1 w-4 rounded-full transition-colors duration-300 ${
                i <= stage ? "bg-brand-purple" : "bg-border"
              }`}
            />
          ))}
        </span>
        <span className="min-w-[6ch]">{stages[reducedMotion ? stages.length - 1 : stage]}…</span>
      </div>
    </div>
  );
}
