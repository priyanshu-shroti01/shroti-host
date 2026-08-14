"use client";

import type { CSSProperties, ReactNode } from "react";
import { Tilt3D } from "@/components/ui/tilt-3d";

/**
 * Shared kit for the hero 3D scenes — the same isometric stage, plate, and
 * packet vocabulary the homepage infrastructure stack established
 * (rotateX(56°) rotateZ(-42°), slab thickness, glow tokens), packaged so
 * each product hero can compose its own scene showing that product's real
 * mechanic instead of re-deriving the geometry.
 *
 * Every scene is aria-hidden decoration: the hero copy beside it carries
 * the meaning. Pointer tilt on the stage is the sanctioned camera-depth use
 * of Tilt3D (docs/micro-interactions.md "3D tilt").
 */

export function IsoScene({
  children,
  className = "",
  size = 240,
  height = 420,
  dropY = 64,
  tilt = 4,
}: {
  children: ReactNode;
  className?: string;
  /** Side length of the square scene plane, px. */
  size?: number;
  /** Rendered block height, px. */
  height?: number;
  /** Vertical offset to visually centre the projected stack. */
  dropY?: number;
  tilt?: number;
}) {
  return (
    <div aria-hidden="true" className={className}>
      <Tilt3D maxTilt={tilt} depth>
        <div
          className="flex items-center justify-center [transform-style:preserve-3d]"
          style={{ height }}
        >
          <div
            className="relative [transform-style:preserve-3d]"
            style={{
              width: size,
              height: size,
              transform: `translateY(${dropY}px) rotateX(56deg) rotateZ(-42deg)`,
            }}
          >
            {children}
          </div>
        </div>
      </Tilt3D>
    </div>
  );
}

export type IsoPlateTone = "neutral" | "gradient" | "success";

const plateFace: Record<IsoPlateTone, { className: string; background: string }> = {
  neutral: {
    className: "border-[color-mix(in_srgb,var(--color-brand-purple)_28%,var(--color-border-strong))]",
    background:
      "color-mix(in srgb, var(--color-brand-purple) 5%, color-mix(in srgb, var(--color-card) 86%, transparent))",
  },
  gradient: {
    className: "border-brand-purple/60 text-white",
    background: "var(--gradient-hero)",
  },
  success: {
    className: "border-success/45",
    background:
      "color-mix(in srgb, var(--color-success) 10%, color-mix(in srgb, var(--color-card) 86%, transparent))",
  },
};

export function IsoPlate({
  x,
  y,
  size,
  z = 0,
  tone = "neutral",
  active = false,
  grid = false,
  className = "",
  style,
  children,
}: {
  x: number;
  y: number;
  size: number;
  z?: number;
  tone?: IsoPlateTone;
  /** Lifts the face and adds the activation glow — same state signal as the infra stack. */
  active?: boolean;
  /** Fine surface grid texture (the "server floor" motif). */
  grid?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const face = plateFace[tone];
  return (
    <div
      className={`absolute [transform-style:preserve-3d] ${className}`}
      style={{ left: x, top: y, width: size, height: size, transform: `translateZ(${z}px)`, ...style }}
    >
      {/* Slab thickness — the same silhouette a few px lower, darker. */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          transform: "translateZ(-7px)",
          background: "color-mix(in srgb, var(--color-text-primary) 16%, var(--color-surface))",
        }}
      />
      <div
        className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 ${face.className} ${
          active ? "border-brand-purple/70 shadow-[var(--glow-active)]" : ""
        }`}
        style={{
          transform: active ? "translateZ(14px)" : "translateZ(0px)",
          background: active
            ? "color-mix(in srgb, var(--color-brand-purple) 16%, color-mix(in srgb, var(--color-card) 82%, transparent))"
            : face.background,
        }}
      >
        {grid && (
          <div
            className="absolute inset-2.5 rounded-xl opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--color-border-strong) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border-strong) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
        )}
        {children}
      </div>
    </div>
  );
}

/** Soft contact shadow under a scene's stack — kept faint so scattered
 *  compositions read as grounded, never stained. */
export function IsoGround({ inset = -18 }: { inset?: number }) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        inset,
        transform: "translateZ(-30px)",
        background: "radial-gradient(closest-side, rgb(21 17 28 / 0.14), transparent 78%)",
      }}
    />
  );
}

/**
 * A request packet riding the scene's Z axis at plane position (x, y).
 * from > to descends; from < to ascends. Rendered only when the caller has
 * already checked reduced motion (the CSS clamp also zeroes it as a
 * fallback).
 */
export function IsoPacket({
  x,
  y,
  from,
  to,
  delay = 0,
  duration = 3.2,
}: {
  x: number;
  y: number;
  from: number;
  to: number;
  delay?: number;
  duration?: number;
}) {
  return (
    <div
      className="absolute h-3 w-3 rounded-full bg-brand-blue shadow-[var(--glow-packet)]"
      style={
        {
          left: x,
          top: y,
          "--packet-from": `${from}px`,
          "--packet-to": `${to}px`,
          animation: `stack-descend ${duration}s ease-in-out ${delay}s infinite`,
        } as CSSProperties
      }
    />
  );
}
