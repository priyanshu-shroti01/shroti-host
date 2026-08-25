"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor, Preload } from "@react-three/drei";
import * as THREE from "three";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionValue, useSpring } from "framer-motion";
import {
  PHASES,
  cycleOutcome,
  ease,
  edges,
  hubNodes,
  itemNodes,
  nodeById,
  phaseProgress,
  ruleNodes,
  signalNodes,
  allocatorNode,
  chargeNode,
} from "./constants";
import type { CycleState } from "./use-decision-cycle";

/**
 * The hero decision scene.
 *
 * Discipline, per docs/motion-system.md's WebGL clause:
 *   - one ScrollTrigger -> one framer spring -> one useFrame writer
 *   - nothing setStates per frame, nothing allocates per frame
 *   - geometry and materials are created once at module scope and shared
 *   - the palette is read from CSS tokens and re-read on theme change
 *   - labels stay screen-space DOM (rendered by the parent, not here)
 *   - the canvas freezes entirely when off-screen
 *
 * Spend is deliberately on composition, depth, material quality and state
 * transitions rather than object count: ~7 draw calls for the whole scene.
 */

/* ----------------------------- shared geometry ---------------------------- */

let signalGeometry: THREE.BufferGeometry | null = null;
let hubGeometry: THREE.BufferGeometry | null = null;
let slabGeometry: THREE.BufferGeometry | null = null;
let chargeGeometry: THREE.BufferGeometry | null = null;
let allocatorGeometry: THREE.BufferGeometry | null = null;
let haloGeometry: THREE.BufferGeometry | null = null;
let haloTexture: THREE.Texture | null = null;
let floorGeometry: THREE.BufferGeometry | null = null;

/** A soft radial falloff drawn once into a canvas. Without this the halo is a
 *  flat translucent quad — visible as a rectangle, which reads as a bug. */
function ensureHaloTexture(): THREE.Texture {
  if (haloTexture) return haloTexture;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.35, "rgba(255,255,255,0.38)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  haloTexture = new THREE.CanvasTexture(canvas);
  return haloTexture;
}

function ensureGeometry() {
  signalGeometry ??= new THREE.OctahedronGeometry(0.092, 0);
  hubGeometry ??= new THREE.IcosahedronGeometry(0.17, 1);
  slabGeometry ??= new THREE.BoxGeometry(0.62, 0.2, 0.42);
  chargeGeometry ??= new THREE.OctahedronGeometry(0.36, 1);
  allocatorGeometry ??= new THREE.CylinderGeometry(0.26, 0.26, 0.14, 6);
  haloGeometry ??= new THREE.PlaneGeometry(1, 1);
  floorGeometry ??= new THREE.PlaneGeometry(14, 10, 14, 10);
}

/** Edge subdivision — enough segments to carry a travelling pulse smoothly. */
const EDGE_SEGMENTS = 10;

type EdgeBuffers = { positions: Float32Array; colors: Float32Array; count: number };
let edgeBuffers: EdgeBuffers | null = null;

/** Built once and shared, like the geometry above: the layout is deterministic,
 *  and the colour array is written in place every frame by the single writer. */
function ensureEdgeBuffers(): EdgeBuffers {
  if (edgeBuffers) return edgeBuffers;

  const count = edges.length * EDGE_SEGMENTS;
  const positions = new Float32Array(count * 2 * 3);
  const colors = new Float32Array(count * 2 * 3);
  const from = new THREE.Vector3();
  const to = new THREE.Vector3();
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  let ptr = 0;

  edges.forEach((edge) => {
    from.set(...nodeById[edge.from].pos);
    to.set(...nodeById[edge.to].pos);
    for (let s = 0; s < EDGE_SEGMENTS; s += 1) {
      a.lerpVectors(from, to, s / EDGE_SEGMENTS);
      b.lerpVectors(from, to, (s + 1) / EDGE_SEGMENTS);
      // A gentle sag gives the graph depth without adding geometry.
      const bow = Math.sin((s / EDGE_SEGMENTS) * Math.PI) * 0.06;
      const bowB = Math.sin(((s + 1) / EDGE_SEGMENTS) * Math.PI) * 0.06;
      positions.set([a.x, a.y - bow, a.z], ptr * 3);
      positions.set([b.x, b.y - bowB, b.z], (ptr + 1) * 3);
      ptr += 2;
    }
  });

  edgeBuffers = { positions, colors, count };
  return edgeBuffers;
}

/* ------------------------------- palette ---------------------------------- */

type ScenePalette = {
  purple: THREE.Color;
  blue: THREE.Color;
  idle: THREE.Color;
  active: THREE.Color;
  rejected: THREE.Color;
  edgeIdle: THREE.Color;
  edgeActive: THREE.Color;
  shadow: THREE.Color;
};

function readCssColor(probe: HTMLElement, cssValue: string): THREE.Color {
  probe.style.color = cssValue;
  const parts = getComputedStyle(probe).color.match(/[\d.]+/g);
  const color = new THREE.Color();
  if (parts && parts.length >= 3) {
    color.setRGB(+parts[0] / 255, +parts[1] / 255, +parts[2] / 255, THREE.SRGBColorSpace);
  } else {
    color.setRGB(0.66, 0.06, 0.78, THREE.SRGBColorSpace);
  }
  return color;
}

function luminance(color: THREE.Color): number {
  return 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
}

function readPalette(): ScenePalette {
  const probe = document.createElement("span");
  probe.style.display = "none";
  document.body.appendChild(probe);
  const purple = readCssColor(probe, "var(--color-brand-purple)");
  const blue = readCssColor(probe, "var(--color-brand-blue)");
  const card = readCssColor(probe, "var(--color-card)");
  const borderStrong = readCssColor(probe, "var(--color-border-strong)");
  const textPrimary = readCssColor(probe, "var(--color-text-primary)");
  const bg = readCssColor(probe, "var(--color-bg)");
  probe.remove();

  const dark = luminance(bg) < 0.5;
  return {
    purple,
    blue,
    idle: card.clone().lerp(borderStrong, dark ? 0.75 : 0.7),
    active: purple.clone().lerp(blue, 0.15),
    // A losing rule reads as receded, never as a hole punched in the scene:
    // lift it toward the border colour rather than sinking it into the canvas.
    rejected: card.clone().lerp(borderStrong, dark ? 0.5 : 0.35),
    edgeIdle: borderStrong.clone().lerp(bg, dark ? 0.62 : 0.15),
    edgeActive: blue.clone().lerp(purple, 0.35),
    shadow: luminance(textPrimary) < luminance(bg) ? textPrimary : bg,
  };
}

/* ------------------------------ scene body -------------------------------- */

const scratchColor = new THREE.Color();
const scratchColorB = new THREE.Color();
const scratchMatrix = new THREE.Matrix4();
const scratchVec = new THREE.Vector3();
const scratchQuat = new THREE.Quaternion();
const scratchScale = new THREE.Vector3(1, 1, 1);
/** Centroid of the two lanes — the point the camera actually frames. */
const FOCUS = new THREE.Vector3(-0.65, 0.05, 0);

function DecisionGraph({
  palette,
  stateRef,
  pointerRef,
  getDolly,
}: {
  palette: ScenePalette;
  stateRef: React.RefObject<CycleState>;
  pointerRef: React.RefObject<{ x: number; y: number }>;
  getDolly: () => number;
}) {
  ensureGeometry();
  const { camera } = useThree();

  const signalsRef = useRef<THREE.InstancedMesh>(null);
  const hubsRef = useRef<THREE.InstancedMesh>(null);
  const rulesRef = useRef<THREE.InstancedMesh>(null);
  const itemsRef = useRef<THREE.InstancedMesh>(null);
  const allocatorRef = useRef<THREE.Mesh>(null);
  const chargeRef = useRef<THREE.Mesh>(null);
  const chargeHaloRef = useRef<THREE.Mesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const edgeData = ensureEdgeBuffers();

  // Seed instance transforms once — nothing here moves, only colour and scale.
  useEffect(() => {
    const place = (mesh: THREE.InstancedMesh | null, nodes: typeof signalNodes) => {
      if (!mesh) return;
      nodes.forEach((node, i) => {
        scratchVec.set(...node.pos);
        scratchMatrix.compose(scratchVec, scratchQuat, scratchScale);
        mesh.setMatrixAt(i, scratchMatrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    };
    place(signalsRef.current, signalNodes);
    place(hubsRef.current, hubNodes);
    place(rulesRef.current, ruleNodes);
    place(itemsRef.current, itemNodes);
  }, []);

  useFrame((_, delta) => {
    const state = stateRef.current;
    if (!state) return;

    // The clock lives in useDecisionCycle so the canvas, the CSS fallback and
    // the DOM legend all read the same instant. Here we only sample it.
    const dt = Math.min(delta, 0.05);
    const t = state.t;
    const { winningRule, excludedItem } = cycleOutcome(state.cycle);

    const gather = ease(phaseProgress(t, PHASES.gather));
    const test = ease(phaseProgress(t, PHASES.test));
    const match = ease(phaseProgress(t, PHASES.match));
    const allocate = ease(phaseProgress(t, PHASES.allocate));
    const settle = ease(phaseProgress(t, PHASES.settle));
    const hold = ease(phaseProgress(t, PHASES.hold));

    /* ---- camera: constrained orbit from pointer, dolly from scroll ---- */
    const pointer = pointerRef.current ?? { x: 0, y: 0 };
    // A shallow azimuth keeps the pipeline reading left-to-right on screen.
    // Swinging further round put the charge node between the camera and the
    // graph, which pushed it out of frame entirely.
    const azimuth = 0.34 + pointer.x * 0.13;
    const polar = 1.25 - pointer.y * 0.08;
    const radius = 8.8 + getDolly() * 1.4;
    camera.position.setFromSphericalCoords(radius, polar, azimuth);
    // Look at the graph's centroid, not the world origin — the two lanes sit
    // left of and below centre, so aiming at 0,0,0 pushes them into a corner.
    camera.position.add(FOCUS);
    camera.lookAt(FOCUS);

    /* ---- signals: light in sequence, then stay lit ---- */
    const signals = signalsRef.current;
    if (signals) {
      for (let i = 0; i < signalNodes.length; i += 1) {
        // Stagger by index so the gather reads as a sweep, not a flash.
        const local = Math.min(Math.max(gather * signalNodes.length - i * 0.55, 0), 1);
        scratchColor.copy(palette.idle).lerp(palette.blue, local * 0.85);
        signals.setColorAt(i, scratchColor);
      }
      if (signals.instanceColor) signals.instanceColor.needsUpdate = true;
    }

    /* ---- hubs: swell as their cluster arrives ---- */
    const hubs = hubsRef.current;
    if (hubs) {
      for (let i = 0; i < hubNodes.length; i += 1) {
        const local = Math.min(Math.max(gather * 1.4 - i * 0.18, 0), 1);
        const scale = 0.82 + local * 0.3;
        scratchVec.set(...hubNodes[i].pos);
        scratchScale.setScalar(scale);
        scratchMatrix.compose(scratchVec, scratchQuat, scratchScale);
        hubs.setMatrixAt(i, scratchMatrix);
        scratchColor.copy(palette.idle).lerp(palette.blue, local);
        hubs.setColorAt(i, scratchColor);
      }
      scratchScale.setScalar(1);
      hubs.instanceMatrix.needsUpdate = true;
      if (hubs.instanceColor) hubs.instanceColor.needsUpdate = true;
    }

    /* ---- rules: all test, one locks, the rest recede ---- */
    const rules = rulesRef.current;
    if (rules) {
      for (let i = 0; i < ruleNodes.length; i += 1) {
        const isWinner = i === winningRule;
        // While testing, every rule shimmers slightly out of phase.
        const shimmer = test * (0.35 + 0.25 * Math.sin(t * 34 + i * 1.7));
        scratchColor.copy(palette.idle).lerp(palette.purple, shimmer);
        if (isWinner) {
          scratchColorB.copy(palette.active);
          scratchColor.lerp(scratchColorB, match);
        } else {
          scratchColorB.copy(palette.rejected);
          scratchColor.lerp(scratchColorB, match);
        }
        rules.setColorAt(i, scratchColor);

        const lift = isWinner ? match * 0.14 : 0;
        const scale = isWinner ? 1 + match * 0.16 : 1 - match * 0.1;
        scratchVec.set(ruleNodes[i].pos[0] + lift, ruleNodes[i].pos[1], ruleNodes[i].pos[2]);
        scratchScale.set(scale, scale, scale);
        scratchMatrix.compose(scratchVec, scratchQuat, scratchScale);
        rules.setMatrixAt(i, scratchMatrix);
      }
      scratchScale.setScalar(1);
      rules.instanceMatrix.needsUpdate = true;
      if (rules.instanceColor) rules.instanceColor.needsUpdate = true;
    }

    /* ---- items: one drops out of the fee base ---- */
    const items = itemsRef.current;
    if (items) {
      for (let i = 0; i < itemNodes.length; i += 1) {
        const excluded = i === excludedItem;
        scratchColor.copy(palette.idle).lerp(excluded ? palette.rejected : palette.purple, allocate * (excluded ? 1 : 0.7));
        items.setColorAt(i, scratchColor);
        const scale = excluded ? 1 - allocate * 0.22 : 1 + allocate * 0.06;
        scratchVec.set(...itemNodes[i].pos);
        scratchScale.set(scale, scale, scale);
        scratchMatrix.compose(scratchVec, scratchQuat, scratchScale);
        items.setMatrixAt(i, scratchMatrix);
      }
      scratchScale.setScalar(1);
      items.instanceMatrix.needsUpdate = true;
      if (items.instanceColor) items.instanceColor.needsUpdate = true;
    }

    /* ---- allocator + charge ---- */
    const allocator = allocatorRef.current;
    if (allocator) {
      allocator.rotation.y += dt * (0.25 + allocate * 1.1);
      const mat = allocator.material as THREE.MeshStandardMaterial;
      mat.color.copy(palette.idle).lerp(palette.purple, allocate);
      mat.emissive.copy(palette.purple);
      mat.emissiveIntensity = allocate * 0.5;
    }

    const charge = chargeRef.current;
    if (charge) {
      const bloom = Math.max(settle, hold);
      const scale = 0.86 + bloom * 0.3;
      charge.scale.setScalar(scale);
      charge.rotation.y += dt * 0.32;
      const mat = charge.material as THREE.MeshStandardMaterial;
      mat.color.copy(palette.idle).lerp(palette.active, bloom);
      mat.emissive.copy(palette.active);
      mat.emissiveIntensity = bloom * 1.25;
    }

    const halo = chargeHaloRef.current;
    if (halo) {
      const bloom = Math.max(settle, hold);
      halo.lookAt(camera.position);
      halo.scale.setScalar(1.5 + bloom * 1.5);
      (halo.material as THREE.MeshBasicMaterial).opacity = bloom * 0.22;
    }

    /* ---- edges: a travelling pulse carries the flow ---- */
    const lines = linesRef.current;
    if (lines) {
      const colors = ensureEdgeBuffers().colors;
      let ptr = 0;
      for (let e = 0; e < edges.length; e += 1) {
        const edge = edges[e];

        let activity = 0;
        let head = 0;
        if (edge.kind === "signal") {
          activity = gather;
          head = gather;
        } else if (edge.kind === "hub") {
          const isWinner = edge.ruleIndex === winningRule;
          activity = test * (isWinner ? 1 : 0.55) * (1 - match * (isWinner ? 0 : 0.85));
          head = test;
        } else if (edge.kind === "item") {
          const excluded = edge.itemIndex === excludedItem;
          activity = allocate * (excluded ? 0.08 : 1);
          head = allocate;
        } else if (edge.kind === "rule") {
          activity = edge.ruleIndex === winningRule ? settle : 0.04;
          head = settle;
        } else {
          activity = settle;
          head = settle;
        }

        for (let s = 0; s < EDGE_SEGMENTS; s += 1) {
          const along = (s + 0.5) / EDGE_SEGMENTS;
          // Bright band centred on the travelling head.
          const band = Math.max(0, 1 - Math.abs(along - head) * 5.5);
          const lit = Math.min(1, activity * (0.22 + band * 1.5));
          scratchColor.copy(palette.edgeIdle).lerp(palette.edgeActive, lit);
          const base = ptr * 3;
          colors[base] = scratchColor.r;
          colors[base + 1] = scratchColor.g;
          colors[base + 2] = scratchColor.b;
          colors[base + 3] = scratchColor.r;
          colors[base + 4] = scratchColor.g;
          colors[base + 5] = scratchColor.b;
          ptr += 2;
        }
      }
      const attr = lines.geometry.getAttribute("color") as THREE.BufferAttribute;
      attr.needsUpdate = true;
    }
  });

  return (
    <group>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edgeData.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[edgeData.colors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.75} />
      </lineSegments>

      <instancedMesh ref={signalsRef} args={[signalGeometry!, undefined, signalNodes.length]}>
        <meshStandardMaterial roughness={0.35} metalness={0.1} />
      </instancedMesh>

      <instancedMesh ref={hubsRef} args={[hubGeometry!, undefined, hubNodes.length]}>
        <meshStandardMaterial roughness={0.28} metalness={0.22} />
      </instancedMesh>

      <instancedMesh ref={rulesRef} args={[slabGeometry!, undefined, ruleNodes.length]}>
        <meshStandardMaterial roughness={0.32} metalness={0.18} />
      </instancedMesh>

      <instancedMesh ref={itemsRef} args={[slabGeometry!, undefined, itemNodes.length]}>
        <meshStandardMaterial roughness={0.4} metalness={0.12} />
      </instancedMesh>

      {/* Wireframe floor: a depth cue, and the only thing in the scene that is
          not a node — it gives the graph somewhere to sit. */}
      <mesh position={[-0.65, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]} geometry={floorGeometry!}>
        <meshBasicMaterial color={palette.edgeIdle} wireframe transparent opacity={0.18} />
      </mesh>

      <mesh ref={allocatorRef} position={allocatorNode.pos} geometry={allocatorGeometry!}>
        <meshStandardMaterial roughness={0.25} metalness={0.35} />
      </mesh>

      <mesh ref={chargeRef} position={chargeNode.pos} geometry={chargeGeometry!}>
        <meshStandardMaterial roughness={0.2} metalness={0.3} />
      </mesh>

      <mesh ref={chargeHaloRef} position={chargeNode.pos} geometry={haloGeometry!}>
        <meshBasicMaterial
          map={ensureHaloTexture()}
          color={palette.active}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* --------------------------------- canvas --------------------------------- */

export function DecisionSceneWebGL({
  onContextLost,
  stateRef,
}: {
  onContextLost: () => void;
  stateRef: React.RefObject<CycleState>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dpr, setDpr] = useState<[number, number]>([1, 1.75]);
  const [inView, setInView] = useState(true);
  // Lazily initialised rather than set inside an effect: this component only
  // ever mounts client-side (dynamic import, ssr:false), so the DOM is there.
  const [palette, setPalette] = useState<ScenePalette | null>(() =>
    typeof document === "undefined" ? null : readPalette(),
  );

  const pointerRef = useRef({ x: 0, y: 0 });

  // Scroll -> one motion value -> one spring -> read inside the single useFrame.
  const dollyMv = useMotionValue(0);
  const dollySpring = useSpring(dollyMv, { stiffness: 70, damping: 20 });
  const getDolly = useMemo(() => () => dollySpring.get(), [dollySpring]);

  useEffect(() => {
    const observer = new MutationObserver(() => setPalette(readPalette()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom top",
      invalidateOnRefresh: true,
      onUpdate: (self) => dollyMv.set(self.progress),
    });
    dollyMv.jump(trigger.progress);
    dollySpring.jump(trigger.progress);
    return () => {
      trigger.kill();
    };
  }, [dollyMv, dollySpring]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "25% 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Pointer parallax, written straight to a ref — never React state.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pointerRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerRef.current.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    };
    const onLeave = () => {
      pointerRef.current.x = 0;
      pointerRef.current.y = 0;
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useEffect(() => {
    // GSAP's ticker drives Lenis; make sure ScrollTrigger knows our height.
    const node = containerRef.current;
    ScrollTrigger.refresh();
    return () => {
      if (node) gsap.killTweensOf(node);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0" aria-hidden="true">
      {palette && (
        <Canvas
          className="absolute inset-0"
          camera={{ fov: 32, position: [4.6, 2.6, 5.8] }}
          dpr={dpr}
          frameloop={inView ? "always" : "never"}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener("webglcontextlost", (event) => {
              event.preventDefault();
              onContextLost();
            });
          }}
        >
          <PerformanceMonitor
            flipflops={2}
            onDecline={() => setDpr([1, 1.25])}
            onFallback={() => setDpr([1, 1])}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[4, 6, 4]} intensity={0.65} />
            {/* Self-contained IBL — no CDN HDRI, three small lightformers. */}
            <Environment resolution={64} frames={1}>
              <Lightformer intensity={2.2} position={[-4, 3, 2]} scale={[6, 3, 1]} color="#cf6cf2" />
              <Lightformer intensity={1.6} position={[5, 1, 3]} scale={[5, 3, 1]} color="#3fa7ff" />
              <Lightformer intensity={0.9} position={[0, -3, -3]} scale={[8, 4, 1]} color="#ffffff" />
            </Environment>
            <DecisionGraph
              palette={palette}
              stateRef={stateRef}
              pointerRef={pointerRef}
              getDolly={getDolly}
            />
            <Preload all />
          </PerformanceMonitor>
        </Canvas>
      )}
    </div>
  );
}
