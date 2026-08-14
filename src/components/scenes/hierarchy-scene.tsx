"use client";

import { Store, Users } from "lucide-react";
import { IsoGround, IsoPacket, IsoPlate, IsoScene } from "@/components/ui/iso-scene";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The reseller family's mechanic: accounts provisioning accounts. Your
 * brand sits at the top; packets flow down as you provision the tiers
 * below. Each variant adds one real level of depth, mirroring the actual
 * product ladder:
 *
 * - reseller: you → client cPanel accounts
 * - master:   you → WHM resellers → their clients
 * - alpha:    you → master resellers → WHM resellers → clients
 */

type Variant = "reseller" | "master" | "alpha";

type Node = { x: number; y: number; size: number; z: number };

const LAYOUTS: Record<
  Variant,
  { parent: Node & { glow?: boolean }; mids: Node[]; leaves: Node[]; packetFrom: number }
> = {
  reseller: {
    parent: { x: 78, y: 78, size: 84, z: 130 },
    mids: [],
    leaves: [
      { x: 16, y: 16, size: 56, z: 0 },
      { x: 168, y: 44, size: 56, z: 0 },
      { x: 56, y: 168, size: 56, z: 0 },
    ],
    packetFrom: 124,
  },
  master: {
    parent: { x: 84, y: 84, size: 72, z: 170 },
    mids: [
      { x: 32, y: 32, size: 52, z: 85 },
      { x: 150, y: 70, size: 52, z: 85 },
    ],
    leaves: [
      { x: 12, y: 12, size: 44, z: 0 },
      { x: 184, y: 56, size: 44, z: 0 },
      { x: 60, y: 184, size: 44, z: 0 },
    ],
    packetFrom: 164,
  },
  alpha: {
    parent: { x: 86, y: 86, size: 68, z: 190, glow: true },
    mids: [
      { x: 20, y: 20, size: 50, z: 95 },
      { x: 168, y: 52, size: 50, z: 95 },
      { x: 56, y: 168, size: 50, z: 95 },
    ],
    leaves: [
      { x: 0, y: 92, size: 38, z: 0 },
      { x: 92, y: 0, size: 38, z: 0 },
      { x: 196, y: 122, size: 38, z: 0 },
      { x: 122, y: 198, size: 38, z: 0 },
    ],
    packetFrom: 184,
  },
};

export function HierarchyScene({ variant, className = "" }: { variant: Variant; className?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const layout = LAYOUTS[variant];

  return (
    <IsoScene className={className}>
      <IsoGround />

      <IsoPlate
        x={layout.parent.x}
        y={layout.parent.y}
        size={layout.parent.size}
        z={layout.parent.z}
        tone="gradient"
        className={layout.parent.glow ? "[&>div:last-child]:shadow-[var(--glow-active)]" : ""}
      >
        <Store
          size={26}
          strokeWidth={1.8}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
        />
      </IsoPlate>

      {layout.mids.map((node) => (
        <IsoPlate key={`m-${node.x}-${node.y}`} x={node.x} y={node.y} size={node.size} z={node.z}>
          <Users
            size={18}
            strokeWidth={1.8}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-purple"
          />
        </IsoPlate>
      ))}

      {layout.leaves.map((node) => (
        <IsoPlate key={`l-${node.x}-${node.y}`} x={node.x} y={node.y} size={node.size} z={node.z} grid />
      ))}

      {!reducedMotion &&
        layout.leaves.slice(0, 3).map((node, i) => (
          <IsoPacket
            key={`p-${node.x}-${node.y}`}
            x={node.x + node.size / 2}
            y={node.y + node.size / 2}
            from={layout.packetFrom}
            to={6}
            delay={i * 1.2}
            duration={3.6}
          />
        ))}
    </IsoScene>
  );
}
