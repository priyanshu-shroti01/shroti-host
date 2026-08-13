"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Pointer-tracked 3D tilt, following the SpotlightCard pattern: CSS custom
 * properties written straight to the node on pointermove, so tracking costs
 * zero React re-renders. The tilt is the motion-system's "hover = node
 * activation" output expressed spatially — the surface acknowledges the
 * pointer as a physical presence over it.
 *
 * Children may opt into real depth with `[transform-style:preserve-3d]`
 * utilities and per-layer `translateZ` — but only when the tilting element
 * itself doesn't clip (`overflow` other than `visible` flattens
 * `transform-style` per spec, so clipped cards tilt as one rigid plane).
 *
 * Touch/pen pointers and reduced-motion users get a plain static wrapper —
 * tilt driven by a finger under the content reads as jitter, not depth.
 */
export function Tilt3D({
  children,
  className = "",
  innerClassName = "",
  maxTilt = 5,
  depth = false,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  /** Peak rotation in degrees at the card's edge. Keep ≤ 6 — past that, text starts to shear. */
  maxTilt?: number;
  /** Set true when children use translateZ layers; leaves clipping off so planes can pop. */
  depth?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || reducedMotion) return;
    const node = ref.current;
    const rect = node?.getBoundingClientRect();
    if (!node || !rect) return;
    // Normalized -0.5 … 0.5 from card centre.
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    node.style.setProperty("--tilt-x", `${(-ny * maxTilt * 2).toFixed(2)}deg`);
    node.style.setProperty("--tilt-y", `${(nx * maxTilt * 2).toFixed(2)}deg`);
  }

  function onPointerLeave() {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--tilt-x", "0deg");
    node.style.setProperty("--tilt-y", "0deg");
  }

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={className}
      style={{ perspective: "1100px" }}
    >
      <div
        className={`transition-transform duration-200 ease-[cubic-bezier(0.33,1,0.68,1)] ${
          depth ? "[transform-style:preserve-3d]" : ""
        } ${innerClassName}`}
        style={{
          transform: "rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))",
        }}
      >
        {children}
      </div>
    </div>
  );
}
