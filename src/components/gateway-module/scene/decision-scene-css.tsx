"use client";

import {
  allNodes,
  allocatorNode,
  chargeNode,
  cycleOutcome,
  edges,
  hubNodes,
  itemNodes,
  nodeById,
  ruleNodes,
  signalNodes,
  type SceneNode,
} from "./constants";
import type { PhaseName } from "./use-decision-cycle";

/**
 * The non-WebGL render path.
 *
 * This is a designed scene, not a placeholder: it draws the same graph, from
 * the same coordinates, and moves through the same phases as the canvas —
 * projected once into 2D and animated with CSS transitions driven by a single
 * `data-phase` attribute on the root. It ships zero JS beyond the shared clock,
 * so it is what phones, low-power tablets, browsers without WebGL2 and crashed
 * canvases all get, and it stays legible in every one of those cases.
 *
 * Under reduced motion the clock parks in `hold`, so this renders the resolved
 * decision as a still diagram — a real alternative rather than a frozen frame.
 */

/** Flatten the shared world coordinates onto a fixed isometric-ish plane. */
const DEPTH_X = 0.34;
const DEPTH_Y = 0.2;
/** Derived from the shared nodes, never hand-tuned — otherwise a coordinate
 *  change in constants.ts silently pushes nodes outside this frame. */
const BOUNDS = (() => {
  const xs = allNodes.map(({ pos: [x, , z] }) => x + z * DEPTH_X);
  const ys = allNodes.map(({ pos: [, y, z] }) => -y + z * DEPTH_Y);
  const pad = 0.32;
  return {
    minX: Math.min(...xs) - pad,
    maxX: Math.max(...xs) + pad,
    minY: Math.min(...ys) - pad,
    maxY: Math.max(...ys) + pad,
  };
})();

function project(node: SceneNode) {
  const [x, y, z] = node.pos;
  const px = x + z * DEPTH_X;
  const py = -y + z * DEPTH_Y;
  return {
    left: ((px - BOUNDS.minX) / (BOUNDS.maxX - BOUNDS.minX)) * 100,
    top: ((py - BOUNDS.minY) / (BOUNDS.maxY - BOUNDS.minY)) * 100,
    /** Farther clusters sit slightly smaller, which reads as depth. */
    depth: z,
  };
}

const VIEW_W = 100;
const VIEW_H = 100;

function edgeClass(kind: string, isWinner: boolean, isExcluded: boolean): string {
  const base = "transition-[stroke-opacity,stroke] duration-700 ease-out-quart";
  if (kind === "signal") return `${base} stroke-brand-blue group-data-[phase=gather]:stroke-opacity-90 stroke-opacity-30`;
  if (kind === "hub") {
    return isWinner
      ? `${base} stroke-brand-purple stroke-opacity-70`
      : `${base} stroke-border-strong stroke-opacity-25`;
  }
  if (kind === "item") {
    return isExcluded
      ? `${base} stroke-border stroke-opacity-15`
      : `${base} stroke-brand-purple stroke-opacity-55`;
  }
  if (kind === "rule") {
    return isWinner
      ? `${base} stroke-brand-purple stroke-opacity-80`
      : `${base} stroke-border stroke-opacity-10`;
  }
  return `${base} stroke-brand-blue stroke-opacity-60`;
}

function Node({
  node,
  className,
  size,
  label,
}: {
  node: SceneNode;
  className: string;
  size: number;
  label?: string;
}) {
  const { left, top, depth } = project(node);
  const scale = 1 - depth * 0.06;
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${left}%`, top: `${top}%`, transform: `translate(-50%,-50%) scale(${scale})` }}
    >
      <div
        className={`rounded-full transition-all duration-700 ease-out-quart ${className}`}
        style={{ width: size, height: size }}
      />
      {label && (
        <span className="mt-1.5 block whitespace-nowrap text-center text-[11px] font-medium text-text-muted">
          {label}
        </span>
      )}
    </div>
  );
}

export function DecisionSceneCSS({ phase, cycle }: { phase: PhaseName; cycle: number }) {
  const { winningRule, excludedItem } = cycleOutcome(cycle);

  return (
    <div
      className="group absolute inset-0 hidden sm:block"
      data-phase={phase}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        fill="none"
      >
        {edges.map((edge, i) => {
          const a = project(nodeById[edge.from]);
          const b = project(nodeById[edge.to]);
          const isWinner = edge.ruleIndex === winningRule;
          const isExcluded = edge.itemIndex === excludedItem;
          return (
            <line
              key={i}
              x1={(a.left / 100) * VIEW_W}
              y1={(a.top / 100) * VIEW_H}
              x2={(b.left / 100) * VIEW_W}
              y2={(b.top / 100) * VIEW_H}
              strokeWidth={isWinner && edge.kind === "rule" ? 0.5 : 0.28}
              vectorEffect="non-scaling-stroke"
              className={edgeClass(edge.kind, isWinner, isExcluded)}
            />
          );
        })}
      </svg>

      {signalNodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          size={10}
          className="border border-border-strong bg-card group-data-[phase=gather]:border-brand-blue group-data-[phase=gather]:bg-brand-blue/40 group-data-[phase=test]:border-brand-blue/70 group-data-[phase=match]:border-brand-blue/50 group-data-[phase=allocate]:border-brand-blue/40 group-data-[phase=settle]:border-brand-blue/30 group-data-[phase=hold]:border-brand-blue/30"
        />
      ))}

      {hubNodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          size={22}
          className="border-2 border-border-strong bg-surface-raised group-data-[phase=gather]:border-brand-blue group-data-[phase=test]:border-brand-blue group-data-[phase=test]:shadow-[var(--glow-packet)]"
        />
      ))}

      {ruleNodes.map((node) => {
        const won = node.ruleIndex === winningRule;
        return (
          <div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${project(node).left}%`, top: `${project(node).top}%` }}
          >
            <div
              className={`h-4 w-16 rounded-full border transition-all duration-700 ease-out-quart ${
                won
                  ? "border-brand-purple bg-brand-purple/25 group-data-[phase=match]:shadow-[var(--glow-active)] group-data-[phase=settle]:shadow-[var(--glow-active)] group-data-[phase=hold]:shadow-[var(--glow-active)]"
                  : "border-border bg-card group-data-[phase=match]:opacity-35 group-data-[phase=allocate]:opacity-35 group-data-[phase=settle]:opacity-30 group-data-[phase=hold]:opacity-30"
              }`}
            />
          </div>
        );
      })}

      {itemNodes.map((node) => {
        const excluded = node.itemIndex === excludedItem;
        return (
          <div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${project(node).left}%`, top: `${project(node).top}%` }}
          >
            <div
              className={`h-3.5 w-14 rounded-full border transition-all duration-700 ease-out-quart ${
                excluded
                  ? "border-border bg-card group-data-[phase=allocate]:opacity-30 group-data-[phase=settle]:opacity-25 group-data-[phase=hold]:opacity-25"
                  : "border-brand-purple/50 bg-brand-purple/15"
              }`}
            />
          </div>
        );
      })}

      <Node
        node={allocatorNode}
        size={26}
        label="Allocator"
        className="border-2 border-border-strong bg-surface-raised group-data-[phase=allocate]:border-brand-purple group-data-[phase=settle]:border-brand-purple group-data-[phase=hold]:border-brand-purple"
      />

      <Node
        node={chargeNode}
        size={34}
        label="Charge"
        className="border-2 border-border-strong bg-surface-raised group-data-[phase=settle]:border-brand-purple group-data-[phase=settle]:bg-brand-purple/25 group-data-[phase=settle]:shadow-[var(--glow-active)] group-data-[phase=hold]:border-brand-purple group-data-[phase=hold]:bg-brand-purple/30 group-data-[phase=hold]:shadow-[var(--glow-active)]"
      />
    </div>
  );
}
