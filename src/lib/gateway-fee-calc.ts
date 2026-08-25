/**
 * Faithful TypeScript port of the Smart Gateway Fees calculation pipeline.
 *
 * Mirrors, in order:
 *   lib/Service/ChargeabilityService.php  — which line items form the fee base
 *   lib/Service/ConditionMatcher.php      — AND-only condition matching
 *   lib/Service/RuleEngine.php            — exclusive, highest-priority-wins
 *   lib/Service/Calculator.php            — the amount itself
 *   lib/Service/InvoiceFeeApplierService.php::constrainAdjustment — safety rails
 *
 * This exists so the on-page demo computes real numbers instead of illustrating
 * invented ones. Every branch below maps to a cited line in the module; if the
 * module changes, this file and its tests are what catch the drift.
 */

export type BillingType = "standard" | "alternative" | "paypalv2";
export type FeeType = "fixed" | "percentage" | "mixed";
export type AdjustmentMode = "surcharge" | "discount";
export type RuleStatus = "active" | "inactive";

/** The 12 condition types the module allows (RuleRepository.php:15-28). */
export type ConditionType =
  | "gateway"
  | "client_id"
  | "client_group"
  | "client_country"
  | "client_currency"
  | "billing_cycle"
  | "subtotal"
  | "total"
  | "invoice_type"
  | "promo_code"
  | "tax_enabled"
  | "is_renewal";

/** All 10 operators (RuleRepository.php:29). Only 5 are reachable from the admin UI. */
export type Operator =
  | "equals"
  | "not_equals"
  | "in"
  | "not_in"
  | "contains"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "between";

export const UI_REACHABLE_OPERATORS: Operator[] = ["equals", "not_equals", "contains", "gte", "lte"];

export type Condition = { type: ConditionType; operator: Operator; value: string };

export type TierStep = {
  id: number;
  minInvoiceAmount: number;
  fixedAmount: number;
  percentageAmount: number;
  status: RuleStatus;
  sortOrder: number;
};

export type Rule = {
  id: number;
  name: string;
  gateway: string;
  status: RuleStatus;
  adjustmentMode: AdjustmentMode;
  feeType: FeeType;
  fixedAmount: number;
  percentageAmount: number;
  /** Magnitude floor. null = none. */
  minimumAmount: number | null;
  /** Magnitude ceiling. null = none. */
  maximumAmount: number | null;
  priority: number;
  label?: string;
  conditions: Condition[];
  steps: TierStep[];
};

/** Item categories the module can resolve (ChargeabilityService.php:130-176). */
export type ItemType = "product" | "addon" | "tld" | "other";

export type LineItem = {
  id: string;
  label: string;
  type: ItemType;
  /** product id, addon id, tld extension, or one of addfunds|latefee|custominvoice|upgrade. */
  key: string;
  amount: number;
  taxed: boolean;
};

/** The 14 signals ContextBuilder.php:23-36 assembles. */
export type EvaluationContext = {
  invoice_id: string;
  client_id: string;
  gateway: string;
  currency_code: string;
  client_group: string;
  client_country: string;
  client_currency: string;
  billing_cycle: string;
  subtotal: number;
  total: number;
  invoice_type: string;
  is_renewal: string;
  promo_code: string;
  tax_enabled: string;
};

export type GatewayConfig = {
  key: string;
  name: string;
  enabled: boolean;
  billingType: BillingType;
  /** Use the tax-inclusive amount as the fee base. */
  chargeAfterTaxing: boolean;
  applyTaxToCharge: boolean;
};

const MAX_PERCENTAGE = 100;
const MAX_GROSS_UP_PERCENTAGE = 100;
/** InvoiceFeeApplierService.php:146 — below this the module deletes its line entirely. */
export const DUST_THRESHOLD = 0.005;

/**
 * PHP's round() is half-away-from-zero; JS Math.round is half-up. They disagree on
 * negatives, which is exactly where discounts live — so don't use Math.round here.
 */
export function round2(value: number): number {
  const scaled = value * 100;
  const magnitude = Math.round(Math.abs(scaled) + Number.EPSILON * Math.abs(scaled));
  return (scaled < 0 ? -magnitude : magnitude) / 100;
}

function round4(value: number): number {
  const scaled = value * 10000;
  const magnitude = Math.round(Math.abs(scaled) + Number.EPSILON * Math.abs(scaled));
  return (scaled < 0 ? -magnitude : magnitude) / 10000;
}

/* -------------------------------------------------------------------------- */
/* Chargeability — ChargeabilityService.php:73-121                              */
/* -------------------------------------------------------------------------- */

export type ChargeableBase = {
  rawSubtotal: number;
  rawTotal: number;
  chargeableSubtotal: number;
  chargeableTotal: number;
  /** Per-item contribution to the fee base. Excluded items contribute 0. */
  contributions: { item: LineItem; chargeable: boolean; share: number }[];
  blocked: boolean;
  reason?: string;
};

/**
 * Reduces an invoice to the portion that may be charged on. Excluded items are
 * removed from the base and the tax component is prorated by the surviving share
 * — not recomputed, which is what keeps discounts from going tax-negative.
 */
export function computeChargeableBase(
  items: LineItem[],
  isItemChargeable: (item: LineItem) => boolean,
  taxComponent: number,
  clientChargeable = true,
): ChargeableBase {
  const rawSubtotal = round2(items.reduce((sum, item) => sum + item.amount, 0));
  const rawTotal = round2(rawSubtotal + taxComponent);

  if (!clientChargeable) {
    return {
      rawSubtotal,
      rawTotal,
      chargeableSubtotal: 0,
      chargeableTotal: 0,
      contributions: items.map((item) => ({ item, chargeable: false, share: 0 })),
      blocked: true,
      reason: "Client excluded from gateway charges.",
    };
  }

  const flags = items.map((item) => isItemChargeable(item));
  const chargeableSubtotal = round2(
    items.reduce((sum, item, index) => (flags[index] ? sum + item.amount : sum), 0),
  );

  const taxRatio = rawSubtotal > 0 ? Math.min(Math.max(chargeableSubtotal / rawSubtotal, 0), 1) : 0;
  const chargeableTotal = round2(chargeableSubtotal + taxComponent * taxRatio);

  const contributions = items.map((item, index) => ({
    item,
    chargeable: flags[index],
    share: flags[index] && chargeableSubtotal > 0 ? item.amount / chargeableSubtotal : 0,
  }));

  if (chargeableSubtotal <= 0.0001) {
    return {
      rawSubtotal,
      rawTotal,
      chargeableSubtotal,
      chargeableTotal,
      contributions,
      blocked: true,
      reason: "No chargeable invoice items matched the current targeting rules.",
    };
  }

  return { rawSubtotal, rawTotal, chargeableSubtotal, chargeableTotal, contributions, blocked: false };
}

/* -------------------------------------------------------------------------- */
/* Condition matching — ConditionMatcher.php:7-65                               */
/* -------------------------------------------------------------------------- */

function compare(actual: string, operator: Operator, expected: string): boolean {
  const a = actual.toLowerCase();
  const e = expected.toLowerCase();
  const list = () => e.split(",").map((part) => part.trim()).filter(Boolean);

  switch (operator) {
    case "equals":
      return a === e;
    case "not_equals":
      return a !== e;
    case "in":
      return list().includes(a);
    case "not_in":
      return !list().includes(a);
    case "contains":
      return e !== "" && a.includes(e);
    case "gt":
      return Number(actual) > Number(expected);
    case "gte":
      return Number(actual) >= Number(expected);
    case "lt":
      return Number(actual) < Number(expected);
    case "lte":
      return Number(actual) <= Number(expected);
    case "between": {
      const [low, high] = list().map(Number);
      return Number(actual) >= low && Number(actual) <= high;
    }
    default:
      return false;
  }
}

export type ConditionResult = { condition: Condition; actual: string; matched: boolean };

/** AND-only, first-failure-wins. There is no OR, no grouping, no nesting. */
export function evaluateConditions(
  conditions: Condition[],
  context: EvaluationContext,
): { matched: boolean; results: ConditionResult[] } {
  const results: ConditionResult[] = [];
  let matched = true;

  for (const condition of conditions) {
    const raw = (context as unknown as Record<string, unknown>)[condition.type];
    const actual = raw === undefined || raw === null ? "" : String(raw);
    const ok = compare(actual, condition.operator, condition.value);
    results.push({ condition, actual, matched: ok });
    if (!ok) {
      matched = false;
      break; // the module stops at the first failure; so do we
    }
  }

  return { matched, results };
}

/* -------------------------------------------------------------------------- */
/* Calculator.php                                                               */
/* -------------------------------------------------------------------------- */

export function normalizePercentage(value: number, billingType: BillingType): number {
  const percentage = Math.max(value, 0);
  if (billingType === "alternative" || billingType === "paypalv2") {
    return percentage >= MAX_GROSS_UP_PERCENTAGE ? 0 : percentage;
  }
  return Math.min(percentage, MAX_PERCENTAGE);
}

/**
 * Steps are read in min_invoice_amount DESC order and the first active step at or
 * below the base wins — so a matching tier *replaces* the rule's own amounts.
 */
export function resolveStep(rule: Rule, baseAmount: number): TierStep | null {
  const ordered = [...rule.steps].sort(
    (a, b) => b.minInvoiceAmount - a.minInvoiceAmount || a.sortOrder - b.sortOrder || b.id - a.id,
  );
  for (const step of ordered) {
    if (step.status !== "active") continue;
    if (baseAmount >= step.minInvoiceAmount) return step;
  }
  return null;
}

export function resolveBaseAmount(context: EvaluationContext, chargeAfterTaxing: boolean): number {
  const subtotal = context.subtotal ?? 0;
  const total = context.total ?? subtotal;
  if (chargeAfterTaxing) return total > 0 ? total : subtotal;
  return subtotal;
}

function calculateUsingBillingType(
  billingType: BillingType,
  baseAmount: number,
  fixedAmount: number,
  percentageAmount: number,
  feeType: FeeType,
): number {
  const base = Math.max(baseAmount, 0);
  const ratio = 1 - percentageAmount / 100;

  const normalizeForFeeType = (amount: number): number => {
    if (feeType === "fixed") return fixedAmount;
    if (feeType === "percentage") return amount - fixedAmount;
    return amount;
  };

  if (billingType === "alternative" && ratio > 0) {
    return normalizeForFeeType(base / ratio - base + fixedAmount);
  }

  if (billingType === "paypalv2" && ratio > 0) {
    return normalizeForFeeType((base + fixedAmount) / ratio - base);
  }

  if (feeType === "fixed") return fixedAmount;
  if (feeType === "percentage") return base * (percentageAmount / 100);
  return fixedAmount + base * (percentageAmount / 100);
}

export type RuleCalculation = {
  amount: number;
  baseAmount: number;
  billingType: BillingType;
  step: TierStep | null;
  fixedAmount: number;
  percentageAmount: number;
};

export function calculateRule(
  rule: Rule,
  context: EvaluationContext,
  gateway: GatewayConfig,
): RuleCalculation {
  const billingType = gateway.billingType;
  const baseAmount = Math.max(resolveBaseAmount(context, gateway.chargeAfterTaxing), 0);
  const step = resolveStep(rule, baseAmount);

  // Amounts are magnitudes; direction comes only from adjustmentMode, so a negative
  // configured value can never silently invert a surcharge into a discount.
  const fixedAmount = Math.max(step ? step.fixedAmount : rule.fixedAmount, 0);
  const percentageAmount = normalizePercentage(
    step ? step.percentageAmount : rule.percentageAmount,
    billingType,
  );

  let amount = calculateUsingBillingType(
    billingType,
    baseAmount,
    fixedAmount,
    percentageAmount,
    rule.feeType,
  );
  amount = Math.max(amount, 0);

  if (rule.minimumAmount !== null) amount = Math.max(amount, Math.abs(rule.minimumAmount));
  if (rule.maximumAmount !== null) amount = Math.min(amount, Math.abs(rule.maximumAmount));

  amount = round2(amount);
  if (rule.adjustmentMode === "discount") amount *= -1;

  return {
    amount,
    baseAmount: round2(baseAmount),
    billingType,
    step,
    fixedAmount: round2(fixedAmount),
    percentageAmount: round4(percentageAmount),
  };
}

/* -------------------------------------------------------------------------- */
/* Safety rails — InvoiceFeeApplierService.php:365-426                          */
/* -------------------------------------------------------------------------- */

export type ConstraintOutcome =
  | { amount: number; capped: null }
  | { amount: number; capped: "suppressed" | "discount" | "surcharge"; ceiling?: number };

export function constrainAdjustment(
  amount: number,
  baseTotal: number,
  maxFeePercentOfInvoice = 100,
): ConstraintOutcome {
  const base = round2(baseTotal);

  if (base <= 0) return { amount: 0, capped: "suppressed" };

  if (amount < 0 && Math.abs(amount) > base) {
    return { amount: round2(-base), capped: "discount" };
  }

  const percent = maxFeePercentOfInvoice > 0 ? maxFeePercentOfInvoice : 100;
  const ceiling = round2(base * (percent / 100));
  if (amount > ceiling) return { amount: ceiling, capped: "surcharge", ceiling };

  return { amount, capped: null };
}

/* -------------------------------------------------------------------------- */
/* RuleEngine.php — exclusive: highest priority match wins, then stop            */
/* -------------------------------------------------------------------------- */

export type RuleOutcome = {
  rule: Rule;
  matched: boolean;
  results: ConditionResult[];
  /** Set only for the winning rule. */
  calculation?: RuleCalculation;
  /** Why a rule was passed over, when it wasn't a condition failure. */
  skipped?: "inactive" | "gateway-disabled" | "other-gateway" | "superseded";
};

export type Evaluation = {
  blocked: boolean;
  reason?: string;
  /** Every rule considered, in evaluation order — including the rejected ones. */
  outcomes: RuleOutcome[];
  winner: RuleOutcome | null;
  /** After caps and the dust threshold. */
  amount: number;
  capped: ConstraintOutcome["capped"];
  ceiling?: number;
  removedAsDust: boolean;
};

export function evaluate(
  rules: Rule[],
  context: EvaluationContext,
  gateway: GatewayConfig,
  base: ChargeableBase,
  maxFeePercentOfInvoice = 100,
): Evaluation {
  if (base.blocked) {
    return {
      blocked: true,
      reason: base.reason,
      outcomes: [],
      winner: null,
      amount: 0,
      capped: null,
      removedAsDust: false,
    };
  }

  const ordered = [...rules].sort((a, b) => b.priority - a.priority || b.id - a.id);
  const outcomes: RuleOutcome[] = [];
  let winner: RuleOutcome | null = null;

  for (const rule of ordered) {
    if (rule.gateway !== gateway.key) {
      outcomes.push({ rule, matched: false, results: [], skipped: "other-gateway" });
      continue;
    }
    if (rule.status !== "active") {
      outcomes.push({ rule, matched: false, results: [], skipped: "inactive" });
      continue;
    }
    if (!gateway.enabled) {
      outcomes.push({ rule, matched: false, results: [], skipped: "gateway-disabled" });
      continue;
    }

    const { matched, results } = evaluateConditions(rule.conditions, context);

    if (!matched) {
      outcomes.push({ rule, matched: false, results });
      continue;
    }

    if (winner) {
      // conflict_strategy is hardcoded "exclusive" and stop_processing is 1, so
      // nothing after the first match can ever contribute.
      outcomes.push({ rule, matched: true, results, skipped: "superseded" });
      continue;
    }

    const calculation = calculateRule(rule, context, gateway);
    winner = { rule, matched: true, results, calculation };
    outcomes.push(winner);
  }

  if (!winner || !winner.calculation) {
    return { blocked: false, outcomes, winner: null, amount: 0, capped: null, removedAsDust: false };
  }

  const constrained = constrainAdjustment(
    winner.calculation.amount,
    base.chargeableSubtotal,
    maxFeePercentOfInvoice,
  );

  const removedAsDust = Math.abs(constrained.amount) < DUST_THRESHOLD;

  return {
    blocked: false,
    outcomes,
    winner,
    amount: removedAsDust ? 0 : constrained.amount,
    capped: constrained.capped,
    ceiling: "ceiling" in constrained ? constrained.ceiling : undefined,
    removedAsDust,
  };
}
