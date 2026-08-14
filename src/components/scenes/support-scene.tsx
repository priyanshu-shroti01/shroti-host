"use client";

import { Mail, MessageCircle, Phone, Ticket } from "lucide-react";
import { IsoGround, IsoPacket, IsoPlate, IsoScene } from "@/components/ui/iso-scene";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Contact's mechanic: every channel routes to the same human team. Three
 * channel plates float above the support hub; message packets flow down
 * into it.
 */
export function SupportScene({ className = "" }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion();

  const channels = [
    { icon: MessageCircle, x: 16, y: 16 },
    { icon: Mail, x: 172, y: 44 },
    { icon: Phone, x: 56, y: 172 },
  ];

  return (
    <IsoScene className={className} height={360} dropY={48}>
      <IsoGround />

      <IsoPlate x={70} y={70} size={100} z={0} tone="gradient">
        <Ticket
          size={28}
          strokeWidth={1.8}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
        />
      </IsoPlate>

      {channels.map((channel) => (
        <IsoPlate key={`${channel.x}-${channel.y}`} x={channel.x} y={channel.y} size={52} z={115}>
          <channel.icon
            size={19}
            strokeWidth={1.8}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-purple"
          />
        </IsoPlate>
      ))}

      {!reducedMotion &&
        channels.map((channel, i) => (
          <IsoPacket
            key={`${channel.x}-${channel.y}`}
            x={channel.x + 26}
            y={channel.y + 26}
            from={108}
            to={8}
            delay={i * 1.15}
          />
        ))}
    </IsoScene>
  );
}
