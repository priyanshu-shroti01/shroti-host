"use client";

import { useEffect, useState } from "react";
import { Code2, Database, Globe, Server } from "lucide-react";
import { IsoGround, IsoPlate, IsoScene } from "@/components/ui/iso-scene";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * VPS's mechanic: one physical machine, hard isolation between slices.
 * Four VM plates sit above the host slab; the activation highlight walks
 * from slice to slice — each workload spikes alone, its neighbors
 * untouched. Reduced motion holds the calm static grid.
 */
export function VpsScene({ className = "" }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      setActive((prev) => (prev === null ? 0 : (prev + 1) % 4));
    }, 1700);
    return () => clearInterval(id);
  }, [reducedMotion]);

  const slices = [
    { icon: Globe, x: 41, y: 41 },
    { icon: Database, x: 123, y: 41 },
    { icon: Code2, x: 41, y: 123 },
    { icon: Server, x: 123, y: 123 },
  ];

  return (
    <IsoScene className={className}>
      <IsoGround />

      <IsoPlate x={30} y={30} size={180} z={0} grid>
        <span className="absolute bottom-3 left-3 h-2 w-2 rounded-full bg-success" />
        <span className="absolute bottom-3 left-6 h-2 w-2 rounded-full bg-brand-blue" />
      </IsoPlate>

      {slices.map((slice, i) => (
        <IsoPlate key={i} x={slice.x} y={slice.y} size={76} z={45} active={active === i}>
          <slice.icon
            size={20}
            strokeWidth={1.8}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-colors duration-300 ${
              active === i ? "text-brand-purple" : "text-brand-purple/60"
            }`}
          />
        </IsoPlate>
      ))}
    </IsoScene>
  );
}
