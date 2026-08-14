"use client";

import { Infinity as InfinityIcon } from "lucide-react";
import { IsoGround, IsoPlate, IsoScene } from "@/components/ui/iso-scene";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Unlimited hosting's mechanic: the stack keeps growing. Three settled
 * site plates, and a ghost plate perpetually rising off the top and
 * dissolving — add a site without adding a bill. Under reduced motion the
 * ghost is simply absent, leaving a calm static stack.
 */
export function UnlimitedScene({ className = "" }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <IsoScene className={className}>
      <IsoGround />

      <IsoPlate x={45} y={45} size={150} z={0} grid />
      <IsoPlate x={45} y={45} size={150} z={50} />
      <IsoPlate x={45} y={45} size={150} z={100} tone="gradient">
        <InfinityIcon
          size={36}
          strokeWidth={1.8}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
        />
      </IsoPlate>

      {!reducedMotion && (
        <div
          className="absolute rounded-2xl border-2 border-brand-purple/50"
          style={{
            left: 45,
            top: 45,
            width: 150,
            height: 150,
            background:
              "color-mix(in srgb, var(--color-brand-purple) 10%, color-mix(in srgb, var(--color-card) 60%, transparent))",
            animation: "iso-rise-fade 3.4s ease-out infinite",
          }}
        />
      )}
    </IsoScene>
  );
}
