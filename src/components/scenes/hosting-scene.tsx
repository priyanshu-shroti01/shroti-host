"use client";

import { FileText, Globe, Server, ShoppingCart } from "lucide-react";
import { IsoGround, IsoPacket, IsoPlate, IsoScene } from "@/components/ui/iso-scene";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Shared hosting's mechanic: one server, many websites. A server slab on
 * the ground with three site plates floating above it — a portfolio, a
 * store, a blog — and request packets flowing down into the server that
 * serves them all.
 */
export function HostingScene({ className = "" }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion();

  const sites = [
    { icon: Globe, x: 12, y: 12 },
    { icon: ShoppingCart, x: 172, y: 40 },
    { icon: FileText, x: 60, y: 172 },
  ];

  return (
    <IsoScene className={className}>
      <IsoGround />

      <IsoPlate x={45} y={45} size={150} z={0} grid>
        <Server
          size={34}
          strokeWidth={1.7}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-purple/70"
        />
        {/* Status LEDs */}
        <span className="absolute bottom-3 left-3 h-2 w-2 rounded-full bg-success" />
        <span className="absolute bottom-3 left-6 h-2 w-2 rounded-full bg-brand-blue" />
      </IsoPlate>

      {sites.map((site) => (
        <IsoPlate key={`${site.x}-${site.y}`} x={site.x} y={site.y} size={56} z={110}>
          <site.icon
            size={20}
            strokeWidth={1.8}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-purple"
          />
        </IsoPlate>
      ))}

      {!reducedMotion &&
        sites.map((site, i) => (
          <IsoPacket
            key={`${site.x}-${site.y}`}
            x={site.x + 28}
            y={site.y + 28}
            from={104}
            to={6}
            delay={i * 1.1}
          />
        ))}
    </IsoScene>
  );
}
