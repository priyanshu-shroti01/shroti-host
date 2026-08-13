"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cloud, Globe, Monitor, Shield, Zap, type LucideIcon } from "lucide-react";
import { Tilt3D } from "@/components/ui/tilt-3d";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The request path rendered as a real dimensional object: five translucent
 * plates stacked along the Z axis in an isometric scene, with request
 * packets travelling down through the layers. This is the 19_3D_DESIGN_
 * SYSTEM "Server Rack" core object built in pure CSS 3D — no WebGL, a
 * handful of DOM plates and one animated dot, all GPU-composited
 * transforms.
 *
 * The scene is aria-hidden: it duplicates the layer list that sits beside
 * it, which remains the accessible, hoverable source of truth. `hoverIndex`
 * links the two — hovering a list row lifts the matching plate. When
 * nothing is hovered the highlight cycles top→bottom on its own, tracking
 * the packet's descent, so the scene tells the request-path story unaided.
 */

const PLATE_GAP = 54;
const PLATE_COUNT = 5;
/** Matches the `stack-descend` keyframes duration in globals.css. */
const PACKET_LOOP_MS = 3600;

const plateIcons: LucideIcon[] = [Globe, Cloud, Zap, Shield, Monitor];

export function InfraStack3D({ hoverIndex }: { hoverIndex: number | null }) {
  const reducedMotion = usePrefersReducedMotion();
  const [autoIndex, setAutoIndex] = useState<number | null>(null);

  // Self-narration: step the highlight down one layer per packet-fifth so the
  // glow roughly rides the descending packet. Hover always wins; reduced
  // motion renders the stack static in its default state (no cycling, no
  // packet), with the accessible list beside it carrying the full story.
  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      setAutoIndex((prev) => (prev === null || prev >= PLATE_COUNT - 1 ? 0 : prev + 1));
    }, PACKET_LOOP_MS / PLATE_COUNT);
    return () => clearInterval(id);
  }, [reducedMotion]);

  const activeIndex = hoverIndex ?? (reducedMotion ? null : autoIndex);

  return (
    <div aria-hidden="true" className="hidden lg:block">
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

          {plateIcons.map((Icon, i) => {
            // Plate 0 (Internet) sits on top of the stack, plate 4 (website) at the base.
            const plateZ = (PLATE_COUNT - 1 - i) * PLATE_GAP;
            const active = activeIndex === i;
            const dimmed = hoverIndex !== null && hoverIndex !== i;
            return (
              <motion.div
                key={i}
                initial={reducedMotion ? false : { opacity: 0, z: plateZ + 150 }}
                whileInView={{ opacity: 1, z: plateZ }}
                viewport={{ once: true, margin: "-80px" }}
                // Duration re-evaluates on re-render, so even if the reduced-motion
                // hook resolves true after mount (it starts false for one frame),
                // the entry collapses to an instant jump instead of animating.
                transition={{ duration: reducedMotion ? 0 : 0.6, delay: reducedMotion ? 0 : i * 0.1, ease: [0.33, 1, 0.68, 1] }}
                style={{ z: plateZ }}
                className="absolute inset-0 [transform-style:preserve-3d]"
              >
                {/* Slab thickness — same silhouette a few px lower, darker,
                    so each layer reads as a physical plate, not a sticker. */}
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
                  {i === PLATE_COUNT - 1 && (
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
          })}

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
