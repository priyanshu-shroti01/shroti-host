"use client";

import type { CSSProperties } from "react";
import { Globe } from "lucide-react";
import { IsoPlate, IsoScene } from "@/components/ui/iso-scene";

/**
 * Domains' mechanic: one name resolving across the network. TLD chips
 * orbit the globe node on a dashed ring — the wrapper spins in the scene
 * plane while each chip counter-spins composed with the billboard
 * transform (the inverse of the isometric rotation), so labels stay crisp
 * and camera-facing. Reduced motion clamps both spins to a coherent
 * static frame.
 */

const ORBIT_SECONDS = 45;

/** Precomputed positions on a radius-100 ring around the scene centre (120,120). */
const TLDS: { label: string; cx: number; cy: number }[] = [
  { label: ".com", cx: 220, cy: 120 },
  { label: ".in", cx: 151, cy: 215 },
  { label: ".net", cx: 39, cy: 179 },
  { label: ".org", cx: 39, cy: 61 },
  { label: ".store", cx: 151, cy: 25 },
];

export function DomainsScene({ className = "" }: { className?: string }) {
  return (
    <IsoScene className={className} height={330} dropY={16}>
      {/* Orbit ring */}
      <div className="absolute inset-5 rounded-full border-2 border-dashed border-[color-mix(in_srgb,var(--color-brand-purple)_30%,var(--color-border-strong))]" />

      <IsoPlate x={88} y={88} size={64} z={50} tone="gradient">
        <Globe
          size={26}
          strokeWidth={1.8}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
        />
      </IsoPlate>

      <div
        className="absolute inset-0 [transform-style:preserve-3d]"
        style={{ animation: `orbit-spin ${ORBIT_SECONDS}s linear infinite` }}
      >
        {TLDS.map((tld) => (
          <div
            key={tld.label}
            className="absolute [transform-style:preserve-3d]"
            style={{ left: tld.cx - 28, top: tld.cy - 12, width: 56, height: 24 }}
          >
            <div
              className="flex h-full w-full items-center justify-center rounded-full border border-border-strong bg-card text-xs font-bold text-brand-purple shadow-[var(--shadow-card)]"
              style={{ animation: `orbit-billboard ${ORBIT_SECONDS}s linear infinite` } as CSSProperties}
            >
              {tld.label}
            </div>
          </div>
        ))}
      </div>
    </IsoScene>
  );
}
