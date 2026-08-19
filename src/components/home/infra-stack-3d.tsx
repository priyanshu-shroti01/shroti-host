"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { Cloud, Globe, Monitor, Shield, Zap, type LucideIcon } from "lucide-react";
import { Tilt3D } from "@/components/ui/tilt-3d";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The request path rendered as a real dimensional object — five translucent
 * plates along the Z axis in an isometric scene, with request packets
 * travelling down through the layers. Pure CSS 3D; no WebGL.
 *
 * EXPLODED VIEW (redesign-plan.md): the stack arrives collapsed — one solid
 * server object — and *comes apart* into its layers as the section scrolls
 * into view. Scroll progress drives plate separation through a spring, all
 * transform-only. Justification (animation-principles.md): this animation
 * exists so the user understands the hosting stack has independent,
 * inspectable layers. Hovering the adjacent list still lifts one plate.
 *
 * Reduced motion: statically exploded (the informative state) — no
 * collapse, no cycling, no packet. The scene stays aria-hidden; the list
 * beside it is the accessible source of truth.
 */

const PLATE_GAP = 54;
/** Separation at first sight — a nearly-solid block that then explodes. */
const COLLAPSED_GAP = 14;
const PLATE_COUNT = 5;
/** Matches the `stack-descend` keyframes duration in globals.css. */
const PACKET_LOOP_MS = 3600;

const plateIcons: LucideIcon[] = [Globe, Cloud, Zap, Shield, Monitor];

function Plate({
  index,
  Icon,
  gap,
  active,
  dimmed,
  reducedMotion,
}: {
  index: number;
  Icon: LucideIcon;
  gap: MotionValue<number>;
  active: boolean;
  dimmed: boolean;
  reducedMotion: boolean;
}) {
  // Plate 0 (Internet) on top, plate 4 (website) at the base.
  const layer = PLATE_COUNT - 1 - index;
  const z = useTransform(gap, (g) => layer * g);

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : index * 0.08 }}
      style={{ z: reducedMotion ? layer * PLATE_GAP : z }}
      className="absolute inset-0 [transform-style:preserve-3d]"
    >
      {/* Slab thickness — same silhouette a few px lower, darker, so each
          layer reads as a physical plate, not a sticker. */}
      <div
        className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${dimmed ? "opacity-30" : ""}`}
        style={{
          transform: "translateZ(-7px)",
          background: "color-mix(in srgb, var(--color-text-primary) 16%, var(--color-surface))",
        }}
      />
      <div
        className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 ${
          active
            ? "border-brand-purple/70 shadow-[var(--glow-active)]"
            : "border-[color-mix(in_srgb,var(--color-brand-purple)_28%,var(--color-border-strong))]"
        } ${dimmed ? "opacity-40" : ""}`}
        style={{
          transform: active ? "translateZ(16px)" : "translateZ(0px)",
          background: active
            ? "color-mix(in srgb, var(--color-brand-purple) 16%, color-mix(in srgb, var(--color-card) 82%, transparent))"
            : "color-mix(in srgb, var(--color-brand-purple) 5%, color-mix(in srgb, var(--color-card) 86%, transparent))",
        }}
      >
        <Icon
          size={36}
          strokeWidth={1.7}
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
            active ? "scale-110 text-brand-purple" : "text-brand-purple/60"
          }`}
        />
        {/* Fine surface grid on the base plate — your website's server floor. */}
        {index === PLATE_COUNT - 1 && (
          <div
            className="absolute inset-3 rounded-2xl opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--color-border-strong) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border-strong) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

export function InfraStack3D({ hoverIndex }: { hoverIndex: number | null }) {
  const reducedMotion = usePrefersReducedMotion();
  const [autoIndex, setAutoIndex] = useState<number | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  // Scroll-driven explosion: 0 where the scene enters the viewport bottom,
  // 1 by the time it reaches the upper third — then it stays exploded.
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start 95%", "start 38%"],
  });
  const gapSpring = useSpring(useTransform(scrollYProgress, [0, 1], [COLLAPSED_GAP, PLATE_GAP]), {
    stiffness: 90,
    damping: 20,
  });

  // Self-narration: step the highlight down one layer per packet-fifth so the
  // glow roughly rides the descending packet. Hover always wins.
  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      setAutoIndex((prev) => (prev === null || prev >= PLATE_COUNT - 1 ? 0 : prev + 1));
    }, PACKET_LOOP_MS / PLATE_COUNT);
    return () => clearInterval(id);
  }, [reducedMotion]);

  const activeIndex = hoverIndex ?? (reducedMotion ? null : autoIndex);

  return (
    <div ref={sceneRef} aria-hidden="true" className="hidden lg:block">
      {/* Camera depth, not decoration: pointer parallax on the one literal 3D
          object the site renders reads as orbiting it — the sanctioned
          non-interactive Tilt3D use (see docs/micro-interactions.md "3D tilt"). */}
      <Tilt3D maxTilt={4} depth>
      <div className="flex h-[440px] items-center justify-center [transform-style:preserve-3d]">
        <div
          className="relative h-[240px] w-[240px] [transform-style:preserve-3d]"
          style={{ transform: "translateY(70px) rotateX(56deg) rotateZ(-42deg)" }}
        >
          {/* Contact shadow under the stack */}
          <div
            className="absolute inset-[-18px] rounded-full"
            style={{
              transform: "translateZ(-30px)",
              background: "radial-gradient(closest-side, rgb(21 17 28 / 0.3), transparent 78%)",
            }}
          />

          {plateIcons.map((Icon, i) => (
            <Plate
              key={i}
              index={i}
              Icon={Icon}
              gap={gapSpring}
              active={activeIndex === i}
              dimmed={hoverIndex !== null && hoverIndex !== i}
              reducedMotion={reducedMotion}
            />
          ))}

          {/* Request packet riding the stack axis, top plate → base. */}
          {!reducedMotion && (
            <div
              className="absolute left-1/2 top-1/2 h-3.5 w-3.5 rounded-full bg-brand-blue shadow-[var(--glow-packet)]"
              style={{ animation: `stack-descend ${PACKET_LOOP_MS}ms ease-in-out infinite` }}
            />
          )}
        </div>
      </div>
      </Tilt3D>
    </div>
  );
}
