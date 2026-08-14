"use client";

import { Rocket } from "lucide-react";
import { IsoGround, IsoPlate, IsoScene } from "@/components/ui/iso-scene";

/**
 * About's object: the ShrotiHost stack itself — the platform the story is
 * about, calm and assembled, with the journey marker on top.
 */
export function BrandScene({ className = "" }: { className?: string }) {
  return (
    <IsoScene className={className} height={360} dropY={48}>
      <IsoGround />

      <IsoPlate x={45} y={45} size={150} z={0} grid />
      <IsoPlate x={45} y={45} size={150} z={50} />
      <IsoPlate x={45} y={45} size={150} z={100} tone="gradient">
        <Rocket
          size={34}
          strokeWidth={1.8}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
        />
      </IsoPlate>
    </IsoScene>
  );
}
