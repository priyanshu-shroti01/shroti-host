"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Html,
  Lightformer,
  PerformanceMonitor,
  Preload,
} from "@react-three/drei";
import { useMotionValue, useSpring } from "framer-motion";
import { ScrollTrigger } from "@/lib/gsap";
import {
  CalloutLabel,
  COLLAPSED_GAP,
  PACKET_LOOP_MS,
  PLATE_COUNT,
  PLATE_GAP,
  plateIcons,
  plateLabels,
} from "./infra-stack-3d";

/**
 * The exploded infrastructure stack as literal WebGL — same object, same
 * choreography, same justification as the CSS-3D original in
 * infra-stack-3d.tsx (which remains the reduced-motion / no-WebGL / mobile
 * fallback, selected by infra-stack-loader.tsx). Scroll drives plate
 * separation: one ScrollTrigger reads progress (ease-free by construction —
 * raw progress, per docs/motion-system.md), one framer spring smooths it,
 * and a single useFrame writes all three.js state. Nothing here setStates
 * per frame. Callout labels stay screen-space DOM (shared CalloutLabel) so
 * type is never rasterized by the GPU.
 */

/** World scale: 1 unit = 100px of the CSS scene, so constants carry over. */
const PX = 0.01;
/** The DOM callouts map plate Z to screen Y at SCREEN_Y_PER_Z (0.74 px/px);
 *  this camera projects a slightly larger vertical span, so the world gap is
 *  trimmed until plate screen-spacing matches the labels (measured in QA). */
const GAP_WORLD_SCALE = 0.78;
const PLATE_SIZE = 2.4;
const PLATE_THICKNESS = 0.1;
/** How far an active plate lifts along the stack axis (16px in CSS). */
const ACTIVE_LIFT = 0.16;
/** Pointer parallax, degrees — Tilt3D maxTilt parity. */
const MAX_TILT_DEG = 4;

/* ── Theme-resolved colors ─────────────────────────────────────────────── */

/** Resolve a CSS custom property to a THREE.Color via a probe element, so
 *  color-mix()/rgb()-space values all normalize to computed rgb(). */
function readCssColor(probe: HTMLElement, cssValue: string): THREE.Color {
  probe.style.color = cssValue;
  const parts = getComputedStyle(probe).color.match(/[\d.]+/g);
  const color = new THREE.Color();
  if (parts && parts.length >= 3) {
    color.setRGB(+parts[0] / 255, +parts[1] / 255, +parts[2] / 255, THREE.SRGBColorSpace);
  } else {
    color.setRGB(0.66, 0.06, 0.78, THREE.SRGBColorSpace); // brand purple
  }
  return color;
}

interface StackPalette {
  purple: THREE.Color;
  blue: THREE.Color;
  faceIdle: THREE.Color;
  faceActive: THREE.Color;
  side: THREE.Color;
  grid: THREE.Color;
  edgeIdle: THREE.Color;
}

function readPalette(): StackPalette {
  const probe = document.createElement("span");
  probe.style.display = "none";
  document.body.appendChild(probe);
  const purple = readCssColor(probe, "var(--color-brand-purple)");
  const blue = readCssColor(probe, "var(--color-brand-blue)");
  const card = readCssColor(probe, "var(--color-card)");
  const surface = readCssColor(probe, "var(--color-surface)");
  const textPrimary = readCssColor(probe, "var(--color-text-primary)");
  const borderStrong = readCssColor(probe, "var(--color-border-strong)");
  probe.remove();
  return {
    purple,
    blue,
    // Same mixes as the CSS plates: card tinted 5% purple idle, 16% active,
    // border 28% purple into border-strong.
    faceIdle: card.clone().lerp(purple, 0.05),
    faceActive: card.clone().lerp(purple, 0.16),
    side: surface.clone().lerp(textPrimary, 0.16),
    grid: borderStrong,
    edgeIdle: borderStrong.clone().lerp(purple, 0.28),
  };
}

/** Palette snapshot, re-read when data-theme flips. */
function usePalette(): StackPalette | null {
  const [palette, setPalette] = useState<StackPalette | null>(null);
  useEffect(() => {
    // Client-only environment probe (same pattern as use-reduced-motion).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPalette(readPalette());
    const observer = new MutationObserver(() => setPalette(readPalette()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);
  return palette;
}

/* ── Geometry (module-level: one instance shared by all five plates) ────── */

function makePlateGeometry(): THREE.ExtrudeGeometry {
  const half = PLATE_SIZE / 2;
  const r = 0.16; // rounded-2xl on a 240px plate
  const shape = new THREE.Shape();
  shape.moveTo(-half + r, -half);
  shape.lineTo(half - r, -half);
  shape.absarc(half - r, -half + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(half, half - r);
  shape.absarc(half - r, half - r, r, 0, Math.PI / 2, false);
  shape.lineTo(-half + r, half);
  shape.absarc(-half + r, half - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(-half, -half + r);
  shape.absarc(-half + r, -half + r, r, Math.PI, Math.PI * 1.5, false);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: PLATE_THICKNESS,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 2,
    curveSegments: 6,
  });
  geometry.center();
  geometry.rotateX(-Math.PI / 2); // plate lies flat, thickness along Y
  return geometry;
}

/** Fine surface grid for the base plate — the website's "server floor"
 *  (24px cells inside a 12px inset, matching the CSS version). */
function makeGridGeometry(): THREE.BufferGeometry {
  const half = PLATE_SIZE / 2 - 0.12;
  const step = 0.24;
  const points: number[] = [];
  for (let v = -half + step; v < half; v += step) {
    points.push(-half, 0, v, half, 0, v);
    points.push(v, 0, -half, v, 0, half);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  return geometry;
}

let plateGeometry: THREE.ExtrudeGeometry | null = null;
let gridGeometry: THREE.BufferGeometry | null = null;
let edgeGeometry: THREE.EdgesGeometry | null = null;

/* ── The scene ─────────────────────────────────────────────────────────── */

interface SceneProps {
  palette: StackPalette;
  /** Smoothed gap in CSS px (framer spring MotionValue), read per frame. */
  getGap: () => number;
  /** Highlighted layer (hover wins over auto-narration), read per frame. */
  stateRef: React.RefObject<{ activeIndex: number | null; hoverIndex: number | null }>;
  /** Normalized pointer position for camera parallax, read per frame. */
  pointerRef: React.RefObject<{ x: number; y: number }>;
}

function StackScene({ palette, getGap, stateRef, pointerRef }: SceneProps) {
  const camera = useThree((s) => s.camera);
  const plateRefs = useRef<(THREE.Group | null)[]>([]);
  const faceMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const sideMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const edgeMats = useRef<(THREE.LineBasicMaterial | null)[]>([]);
  const packetRef = useRef<THREE.Mesh>(null);
  const packetMat = useRef<THREE.MeshBasicMaterial>(null);
  const lifts = useRef<number[]>(new Array(PLATE_COUNT).fill(0));
  const glows = useRef<number[]>(new Array(PLATE_COUNT).fill(0));
  const parallax = useRef({ x: 0, y: 0 });

  plateGeometry ??= makePlateGeometry();
  gridGeometry ??= makeGridGeometry();
  // The CSS plates' defining feature is their 2px purple-tinted border —
  // reproduce it as edge lines so the layers read as a crisp diagram.
  edgeGeometry ??= new THREE.EdgesGeometry(plateGeometry, 32);

  useFrame((state, delta) => {
    const gap = getGap() * PX * GAP_WORLD_SCALE;
    const progress = Math.min(
      1,
      Math.max(0, (getGap() - COLLAPSED_GAP) / (PLATE_GAP - COLLAPSED_GAP)),
    );
    const { activeIndex, hoverIndex } = stateRef.current;
    const ease = 1 - Math.exp(-9 * delta); // frame-rate-independent damping

    // Camera: gentle dolly-in as the stack comes apart (scroll → camera
    // dolly, docs/motion-system.md) + pointer parallax as orbit.
    parallax.current.x += (pointerRef.current.x - parallax.current.x) * ease;
    parallax.current.y += (pointerRef.current.y - parallax.current.y) * ease;
    const tilt = THREE.MathUtils.degToRad(MAX_TILT_DEG);
    const radius = 10.4 - 1.2 * progress;
    const polar = THREE.MathUtils.degToRad(56) - parallax.current.y * tilt;
    const azimuth = THREE.MathUtils.degToRad(42) + parallax.current.x * tilt;
    camera.position.setFromSphericalCoords(radius, polar, azimuth);
    camera.lookAt(0, -0.1, 0);

    for (let i = 0; i < PLATE_COUNT; i++) {
      const group = plateRefs.current[i];
      const face = faceMats.current[i];
      const side = sideMats.current[i];
      const edge = edgeMats.current[i];
      if (!group || !face || !side || !edge) continue;
      const layer = PLATE_COUNT - 1 - i; // plate 0 (Internet) on top
      const active = activeIndex === i;
      const dimmed = hoverIndex !== null && hoverIndex !== i;

      lifts.current[i] += ((active ? ACTIVE_LIFT : 0) - lifts.current[i]) * ease;
      glows.current[i] += ((active ? 0.2 : 0.03) - glows.current[i]) * ease;
      group.position.y = (layer - 2) * gap + lifts.current[i];

      face.color.lerp(active ? palette.faceActive : palette.faceIdle, ease);
      face.emissive.copy(palette.purple);
      face.emissiveIntensity = glows.current[i];
      const targetOpacity = dimmed ? 0.4 : 0.94;
      face.opacity += (targetOpacity - face.opacity) * ease;
      side.opacity += ((dimmed ? 0.3 : 1) - side.opacity) * ease;
      edge.color.lerp(active ? palette.purple : palette.edgeIdle, ease);
      edge.opacity += ((dimmed ? 0.25 : 0.9) - edge.opacity) * ease;
    }

    // Request packet riding the stack axis, top plate → base (3.6s loop,
    // PACKET_LOOP_MS parity with the CSS keyframes).
    if (packetRef.current && packetMat.current) {
      const t = ((state.clock.elapsedTime * 1000) % PACKET_LOOP_MS) / PACKET_LOOP_MS;
      const eased = 0.5 - 0.5 * Math.cos(Math.PI * t); // ease-in-out
      const from = 2 * gap + 0.24;
      const to = -2 * gap - 0.08;
      packetRef.current.position.y = from + (to - from) * eased;
      const fade = Math.min(t / 0.08, (1 - t) / 0.08, 1);
      packetMat.current.opacity = fade * progress; // no packet while collapsed
    }
  });

  return (
    <group position={[0, 0.1, 0]}>
      {plateLabels.map((label, i) => {
        const Icon = plateIcons[i];
        const layer = PLATE_COUNT - 1 - i;
        return (
          <group key={label} ref={(el) => void (plateRefs.current[i] = el)}>
            <mesh geometry={plateGeometry!}>
              <meshStandardMaterial
                // ExtrudeGeometry group 0 = caps, group 1 = walls
                attach="material-0"
                ref={(el) => void (faceMats.current[i] = el)}
                color={palette.faceIdle}
                emissive={palette.purple}
                emissiveIntensity={0.06}
                metalness={0.15}
                roughness={0.45}
                transparent
                opacity={0.94}
              />
              <meshStandardMaterial
                attach="material-1"
                ref={(el) => void (sideMats.current[i] = el)}
                color={palette.side}
                metalness={0.1}
                roughness={0.6}
                transparent
              />
            </mesh>
            <lineSegments geometry={edgeGeometry!}>
              <lineBasicMaterial
                ref={(el) => void (edgeMats.current[i] = el)}
                color={palette.edgeIdle}
                transparent
                opacity={0.9}
              />
            </lineSegments>
            {layer === 0 && (
              <lineSegments geometry={gridGeometry!} position={[0, PLATE_THICKNESS / 2 + 0.02, 0]}>
                <lineBasicMaterial color={palette.grid} transparent opacity={0.3} />
              </lineSegments>
            )}
            {/* Layer icon lying on the plate face — DOM via drei Html so it
                stays a crisp lucide glyph; transform mode rides the camera. */}
            <Html
              transform
              position={[0, PLATE_THICKNESS / 2 + 0.03, 0]}
              // Lie flat on the plate, spun so the glyph's "up" points toward
              // the camera azimuth and reads upright on screen.
              rotation={[-Math.PI / 2, 0, -Math.PI / 4]}
              distanceFactor={3.2}
              zIndexRange={[30, 0]}
              pointerEvents="none"
              style={{ pointerEvents: "none" }}
            >
              <Icon size={40} strokeWidth={1.7} color="#a810c7" opacity={0.7} />
            </Html>
          </group>
        );
      })}

      <mesh ref={packetRef}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial
          ref={packetMat}
          color={palette.blue}
          toneMapped={false}
          transparent
          opacity={0}
        />
      </mesh>

      <ContactShadows
        position={[0, -1.58, 0]}
        opacity={0.35}
        scale={5.6}
        blur={2.4}
        far={3}
        resolution={256}
        color="#15111c"
      />

      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 8, 2]} intensity={1.15} />
      <Environment resolution={64} frames={1}>
        {/* Studio-strip lighting for the material sheen — self-contained
            Lightformers, no CDN-hosted HDRI preset. */}
        <Lightformer form="rect" intensity={2.2} position={[0, 5, -3]} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={1.4} position={[-5, 2, 2]} scale={[3, 3, 1]} />
        <Lightformer
          form="rect"
          intensity={1.1}
          color="#a810c7"
          position={[4, 1, 4]}
          scale={[2, 2, 1]}
        />
      </Environment>
      <Preload all />
    </group>
  );
}

/* ── Host: canvas + scroll wiring + shared DOM callouts ────────────────── */

export function InfraStackWebGL({
  hoverIndex,
  onContextLost,
}: {
  hoverIndex: number | null;
  onContextLost: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoIndex, setAutoIndex] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  const [dpr, setDpr] = useState<number | [number, number]>([1, 1.75]);

  const palette = usePalette();

  // One ScrollTrigger reads raw progress (linear by construction); one
  // framer spring smooths it for BOTH the WebGL plates and the DOM callouts,
  // so the two layers can never drift apart. Same offsets as the CSS version.
  const gapMv = useMotionValue(COLLAPSED_GAP);
  const gapSpring = useSpring(gapMv, { stiffness: 80, damping: 19 });
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 92%",
      end: "top 34%",
      invalidateOnRefresh: true,
      onUpdate: (self) =>
        gapMv.set(COLLAPSED_GAP + (PLATE_GAP - COLLAPSED_GAP) * self.progress),
    });
    return () => trigger.kill();
  }, [gapMv]);

  // Render only near the viewport — an offscreen canvas burns battery for
  // nobody. frameloop="never" freezes R3F's loop entirely.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "25% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Self-narration, identical to the CSS version: highlight walks down one
  // layer per packet-fifth. Hover always wins.
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      setAutoIndex((prev) => (prev === null || prev >= PLATE_COUNT - 1 ? 0 : prev + 1));
    }, PACKET_LOOP_MS / PLATE_COUNT);
    return () => clearInterval(id);
  }, [inView]);

  const activeIndex = hoverIndex ?? autoIndex;
  const stateRef = useRef({ activeIndex, hoverIndex });
  useEffect(() => {
    stateRef.current = { activeIndex, hoverIndex };
  }, [activeIndex, hoverIndex]);

  const pointerRef = useRef({ x: 0, y: 0 });
  const onPointerMove = (e: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
    };
  };
  const onPointerLeave = () => {
    pointerRef.current = { x: 0, y: 0 };
  };

  const getGap = useMemo(() => () => gapSpring.get(), [gapSpring]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="hidden lg:block"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className="relative flex h-[440px] items-center justify-center pr-36">
        {/* Same screen-space exploded-diagram callouts as the CSS version. */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-36">
          {plateLabels.map((_, i) => (
            <CalloutLabel
              key={i}
              index={i}
              gap={gapSpring}
              active={activeIndex === i}
              reducedMotion={false}
            />
          ))}
        </div>
        {palette && (
          <Canvas
            className="absolute inset-0"
            camera={{ fov: 26, position: [5.2, 5.8, 5.7] }}
            dpr={dpr}
            frameloop={inView ? "always" : "never"}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener("webglcontextlost", (e) => {
                e.preventDefault();
                onContextLost();
              });
            }}
          >
            <PerformanceMonitor
              flipflops={2}
              onDecline={() => setDpr([1, 1.25])}
              onFallback={() => setDpr(1)}
            >
              <StackScene
                palette={palette}
                getGap={getGap}
                stateRef={stateRef}
                pointerRef={pointerRef}
              />
            </PerformanceMonitor>
          </Canvas>
        )}
      </div>
    </div>
  );
}
