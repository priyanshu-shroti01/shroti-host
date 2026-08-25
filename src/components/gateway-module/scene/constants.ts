/**
 * Shared vocabulary for the hero decision scene.
 *
 * Both render paths — WebGL (decision-scene-webgl) and CSS-3D
 * (decision-scene-css) — import this file, so the two can never drift into
 * telling different stories. Coordinates are world units for three.js; the
 * CSS path projects the same numbers through a fixed isometric matrix.
 *
 * What the scene depicts, and why each part is here:
 *   Two lanes converge. The upper lane carries the fourteen context signals
 *   through their three groups into the rule bank, where exactly one rule can
 *   win. The lower lane carries the invoice's own line items through the
 *   allocator, which decides which of them form the fee base. Only when both
 *   lanes resolve does a charge exist. That is the module's actual control
 *   flow, not a decorative graph.
 */

export type StageKey = "signals" | "hubs" | "rules" | "items" | "allocator" | "charge";

export type SceneNode = {
  id: string;
  stage: StageKey;
  label: string;
  /** [x, y, z] in world units. */
  pos: [number, number, number];
  /** Hub/group membership, used to route edges and tint clusters. */
  group?: "customer" | "payment" | "commerce";
  /** Rule bank index, so the cycle can pick a winner. */
  ruleIndex?: number;
  /** Line-item index, so the cycle can exclude one. */
  itemIndex?: number;
};

const SIGNAL_LANE_X = -3.0;
const HUB_X = -1.75;
const RULE_X = -0.2;
const ITEM_X = -1.75;
const ALLOCATOR_X = -0.2;
const CHARGE_X = 1.75;

/** Cluster depth: the three context groups sit on separate z planes so the
 *  camera reads them as distinct volumes rather than one flat column. */
const CLUSTER_Z = { customer: -0.85, payment: 0, commerce: 0.85 } as const;

function column(x: number, z: number, ys: number[]): [number, number, number][] {
  return ys.map((y) => [x, y, z]);
}

const customerYs = [1.55, 1.15, 0.75, 0.35];
const paymentYs = [1.4, 1.0, 0.6];
const commerceYs = [1.9, 1.6, 1.3, 1.0, 0.7, 0.4, 0.1];

/** The fourteen signals, in the module's own grouping. */
export const signalNodes: SceneNode[] = [
  ...column(SIGNAL_LANE_X, CLUSTER_Z.customer, customerYs).map((pos, i) => ({
    id: `sig-customer-${i}`,
    stage: "signals" as const,
    group: "customer" as const,
    label: ["Client", "Client Group", "Country", "Client Currency"][i],
    pos,
  })),
  ...column(SIGNAL_LANE_X, CLUSTER_Z.payment, paymentYs).map((pos, i) => ({
    id: `sig-payment-${i}`,
    stage: "signals" as const,
    group: "payment" as const,
    label: ["Gateway", "Tax State", "Invoice Currency"][i],
    pos,
  })),
  ...column(SIGNAL_LANE_X, CLUSTER_Z.commerce, commerceYs).map((pos, i) => ({
    id: `sig-commerce-${i}`,
    stage: "signals" as const,
    group: "commerce" as const,
    label: ["Subtotal", "Total", "Billing Cycle", "Invoice Type", "Renewal", "Promo Code", "Invoice"][i],
    pos,
  })),
];

export const hubNodes: SceneNode[] = [
  { id: "hub-customer", stage: "hubs", group: "customer", label: "Customer", pos: [HUB_X, 1.0, CLUSTER_Z.customer] },
  { id: "hub-payment", stage: "hubs", group: "payment", label: "Payment", pos: [HUB_X, 1.0, CLUSTER_Z.payment] },
  { id: "hub-commerce", stage: "hubs", group: "commerce", label: "Commerce", pos: [HUB_X, 1.0, CLUSTER_Z.commerce] },
];

/** Four rules in priority order — only one can ever win (exclusive + stop). */
export const ruleNodes: SceneNode[] = [1.62, 1.14, 0.66, 0.18].map((y, i) => ({
  id: `rule-${i}`,
  stage: "rules" as const,
  label: ["Priority 90", "Priority 70", "Priority 50", "Priority 10"][i],
  pos: [RULE_X, y, 0] as [number, number, number],
  ruleIndex: i,
}));

/** Invoice line items feeding the allocator. */
export const itemNodes: SceneNode[] = [-0.45, -0.9, -1.35, -1.8].map((y, i) => ({
  id: `item-${i}`,
  stage: "items" as const,
  label: ["VPS Hosting", "Domain", "Addon", "Late Fee"][i],
  pos: [ITEM_X, y, 0] as [number, number, number],
  itemIndex: i,
}));

export const allocatorNode: SceneNode = {
  id: "allocator",
  stage: "allocator",
  label: "Allocator",
  pos: [ALLOCATOR_X, -1.05, 0],
};

export const chargeNode: SceneNode = {
  id: "charge",
  stage: "charge",
  label: "Charge",
  pos: [CHARGE_X, 0.25, 0],
};

export const allNodes: SceneNode[] = [
  ...signalNodes,
  ...hubNodes,
  ...ruleNodes,
  ...itemNodes,
  allocatorNode,
  chargeNode,
];

export type SceneEdge = {
  from: string;
  to: string;
  /** `rule` edges dim unless their rule wins; `item` edges dim when excluded. */
  kind: "signal" | "hub" | "item" | "rule" | "allocator";
  ruleIndex?: number;
  itemIndex?: number;
};

export const edges: SceneEdge[] = [
  ...signalNodes.map((node) => ({ from: node.id, to: `hub-${node.group}`, kind: "signal" as const })),
  ...hubNodes.flatMap((hub) =>
    ruleNodes.map((rule) => ({ from: hub.id, to: rule.id, kind: "hub" as const, ruleIndex: rule.ruleIndex })),
  ),
  ...itemNodes.map((item) => ({ from: item.id, to: allocatorNode.id, kind: "item" as const, itemIndex: item.itemIndex })),
  ...ruleNodes.map((rule) => ({ from: rule.id, to: chargeNode.id, kind: "rule" as const, ruleIndex: rule.ruleIndex })),
  { from: allocatorNode.id, to: chargeNode.id, kind: "allocator" },
];

export const nodeById: Record<string, SceneNode> = Object.fromEntries(
  allNodes.map((node) => [node.id, node]),
);

/* -------------------------------------------------------------------------- */
/* The decision cycle                                                          */
/* -------------------------------------------------------------------------- */

/** One full evaluation, in seconds. Long enough to read, short enough to loop. */
export const CYCLE_SECONDS = 7.2;

/**
 * Phase boundaries as fractions of a cycle. The scene is not an idle loop —
 * it performs an evaluation, commits to a result, holds it, then re-evaluates
 * with a different winner. Each boundary is a state the visitor can name.
 */
export const PHASES = {
  /** Signals light and travel to their group hub. */
  gather: [0.0, 0.24],
  /** Hubs push into the rule bank; every rule is still live. */
  test: [0.24, 0.44],
  /** One rule locks; the rest visibly lose. */
  match: [0.44, 0.56],
  /** Items resolve through the allocator; excluded items grey out. */
  allocate: [0.34, 0.62],
  /** Both lanes travel to the charge node. */
  settle: [0.6, 0.82],
  /** The charge holds, fully lit, before the next evaluation. */
  hold: [0.82, 1.0],
} as const;

/** Which rule wins on cycle n, and which line item is excluded. Deterministic
 *  so the CSS and WebGL paths tell the identical story at the identical time. */
export function cycleOutcome(cycleIndex: number) {
  const winners = [0, 2, 1, 3];
  const excluded = [2, 3, 2, 1];
  const i = ((cycleIndex % winners.length) + winners.length) % winners.length;
  return { winningRule: winners[i], excludedItem: excluded[i] };
}

export function phaseProgress(t: number, phase: readonly [number, number]): number {
  const [start, end] = phase;
  if (t <= start) return 0;
  if (t >= end) return 1;
  return (t - start) / (end - start);
}

/** Smootherstep — used everywhere so both paths ease identically. */
export function ease(t: number): number {
  const x = Math.min(Math.max(t, 0), 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
}

/** Stage captions, rendered as screen-space DOM in both paths. */
export const stageCaptions: { key: StageKey; label: string; hint: string }[] = [
  { key: "signals", label: "Context", hint: "14 signals" },
  { key: "rules", label: "Rules", hint: "one wins" },
  { key: "allocator", label: "Allocator", hint: "fee base" },
  { key: "charge", label: "Charge", hint: "one line item" },
];
