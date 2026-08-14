"use client";

import { Activity } from "lucide-react";
import { IsoGround, IsoPacket, IsoPlate, IsoScene } from "@/components/ui/iso-scene";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Status's mechanic: a live machine reporting up. The server slab on the
 * ground, a heartbeat packet ascending to the monitor plate above it —
 * uptime you can watch.
 */
export function StatusScene({ className = "" }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <IsoScene className={className} height={360} dropY={48}>
      <IsoGround />

      <IsoPlate x={45} y={45} size={150} z={0} grid>
        <span className="absolute bottom-3 left-3 h-2 w-2 rounded-full bg-success" />
        <span className="absolute bottom-3 left-6 h-2 w-2 rounded-full bg-success" />
        <span className="absolute bottom-3 left-9 h-2 w-2 rounded-full bg-brand-blue" />
      </IsoPlate>

      <IsoPlate x={86} y={86} size={68} z={120} tone="success">
        <Activity
          size={24}
          strokeWidth={1.8}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-success"
        />
      </IsoPlate>

      {!reducedMotion && <IsoPacket x={120} y={120} from={8} to={112} duration={2.6} />}
    </IsoScene>
  );
}
