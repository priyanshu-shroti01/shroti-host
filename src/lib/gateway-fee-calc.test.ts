import { describe, expect, it } from "vitest";
import {
  calculateRule,
  computeChargeableBase,
  constrainAdjustment,
  evaluate,
  evaluateConditions,
  normalizePercentage,
  resolveStep,
  round2,
  type Condition,
  type EvaluationContext,
  type GatewayConfig,
  type LineItem,
  type Rule,
} from "./gateway-fee-calc";

const gateway = (over: Partial<GatewayConfig> = {}): GatewayConfig => ({
  key: "razorpay",
  name: "Razorpay",
  enabled: true,
  billingType: "standard",
  chargeAfterTaxing: false,
  applyTaxToCharge: false,
  ...over,
});

const rule = (over: Partial<Rule> = {}): Rule => ({
  id: 1,
  name: "Base rule",
  gateway: "razorpay",
  status: "active",
  adjustmentMode: "surcharge",
  feeType: "percentage",
  fixedAmount: 0,
  percentageAmount: 3,
  minimumAmount: null,
  maximumAmount: null,
  priority: 100,
  conditions: [],
  steps: [],
  ...over,
});

const context = (over: Partial<EvaluationContext> = {}): EvaluationContext => ({
  invoice_id: "1001",
  client_id: "42",
  gateway: "razorpay",
  currency_code: "INR",
  client_group: "Reseller",
  client_country: "IN",
  client_currency: "INR",
  billing_cycle: "monthly",
  subtotal: 1000,
  total: 1000,
  invoice_type: "standard",
  is_renewal: "0",
  promo_code: "",
  tax_enabled: "0",
  ...over,
});

describe("round2 — PHP half-away-from-zero, not JS half-up", () => {
  it("rounds positives away from zero", () => {
    expect(round2(0.125)).toBe(0.13);
    expect(round2(30.927835)).toBe(30.93);
  });

  it("rounds negatives away from zero, where Math.round would differ", () => {
    expect(round2(-0.125)).toBe(-0.13);
    expect(Math.round(-12.5) / 100).toBe(-0.12); // the bug this avoids
  });
});

describe("Calculator — billing types x fee types", () => {
  it("standard/percentage takes a plain cut of the base", () => {
    expect(calculateRule(rule(), context(), gateway()).amount).toBe(30);
  });

  it("standard/fixed ignores the base entirely", () => {
    expect(calculateRule(rule({ feeType: "fixed", fixedAmount: 25 }), context(), gateway()).amount).toBe(25);
  });

  it("standard/mixed adds both", () => {
    const r = rule({ feeType: "mixed", fixedAmount: 5, percentageAmount: 3 });
    expect(calculateRule(r, context(), gateway()).amount).toBe(35);
  });

  it("alternative grosses up so the fee survives the gateway's own cut", () => {
    const g = gateway({ billingType: "alternative" });
    // 1000/0.97 - 1000 = 30.9278...
    expect(calculateRule(rule(), context(), g).amount).toBe(30.93);
  });

  it("alternative/mixed adds the fixed amount on top of the gross-up", () => {
    const r = rule({ feeType: "mixed", fixedAmount: 5 });
    expect(calculateRule(r, context(), gateway({ billingType: "alternative" })).amount).toBe(35.93);
  });

  it("paypalv2 grosses up the base *and* the fixed amount together", () => {
    const r = rule({ feeType: "percentage", fixedAmount: 5 });
    // (1005/0.97) - 1000 - 5 = 31.0824...
    expect(calculateRule(r, context(), gateway({ billingType: "paypalv2" })).amount).toBe(31.08);
  });

  it("paypalv2/mixed keeps the fixed amount inside the result", () => {
    const r = rule({ feeType: "mixed", fixedAmount: 5 });
    expect(calculateRule(r, context(), gateway({ billingType: "paypalv2" })).amount).toBe(36.08);
  });

  it("a gross-up percentage at or above 100 is neutralised, not infinite", () => {
    expect(normalizePercentage(100, "alternative")).toBe(0);
    expect(normalizePercentage(150, "paypalv2")).toBe(0);
    expect(normalizePercentage(150, "standard")).toBe(100);
  });
});

describe("Calculator — caps and direction", () => {
  it("applies the minimum as a floor on the magnitude", () => {
    const r = rule({ percentageAmount: 1, minimumAmount: 25 }); // 10 -> 25
    expect(calculateRule(r, context(), gateway()).amount).toBe(25);
  });

  it("applies the maximum as a ceiling on the magnitude", () => {
    const r = rule({ percentageAmount: 10, maximumAmount: 50 }); // 100 -> 50
    expect(calculateRule(r, context(), gateway()).amount).toBe(50);
  });

  it("uses caps as magnitudes even when they are configured negative", () => {
    const r = rule({ percentageAmount: 10, maximumAmount: -50 });
    expect(calculateRule(r, context(), gateway()).amount).toBe(50);
  });

  it("takes direction only from adjustmentMode, never from a negative input", () => {
    const negative = rule({ fixedAmount: -40, feeType: "fixed" });
    expect(calculateRule(negative, context(), gateway()).amount).toBe(0);

    const discount = rule({ adjustmentMode: "discount" });
    expect(calculateRule(discount, context(), gateway()).amount).toBe(-30);
  });

  it("charges on the tax-inclusive total when the gateway says so", () => {
    const ctx = context({ subtotal: 1000, total: 1180 });
    expect(calculateRule(rule(), ctx, gateway({ chargeAfterTaxing: true })).amount).toBe(35.4);
    expect(calculateRule(rule(), ctx, gateway()).amount).toBe(30);
  });
});

describe("Tier steps", () => {
  const stepped = rule({
    steps: [
      { id: 1, minInvoiceAmount: 1000, fixedAmount: 0, percentageAmount: 2, status: "active", sortOrder: 100 },
      { id: 2, minInvoiceAmount: 4000, fixedAmount: 0, percentageAmount: 1, status: "active", sortOrder: 100 },
    ],
  });

  it("picks the highest tier at or below the base", () => {
    expect(resolveStep(stepped, 5000)?.id).toBe(2);
    expect(resolveStep(stepped, 2000)?.id).toBe(1);
    expect(resolveStep(stepped, 500)).toBeNull();
  });

  it("lets a matching tier replace the rule's own amounts", () => {
    expect(calculateRule(stepped, context({ subtotal: 5000, total: 5000 }), gateway()).amount).toBe(50);
  });

  it("falls back to the rule's own amounts below every tier", () => {
    expect(calculateRule(stepped, context({ subtotal: 500, total: 500 }), gateway()).amount).toBe(15);
  });

  it("skips inactive tiers", () => {
    const r = rule({
      steps: [{ id: 3, minInvoiceAmount: 100, fixedAmount: 0, percentageAmount: 99, status: "inactive", sortOrder: 100 }],
    });
    expect(calculateRule(r, context(), gateway()).amount).toBe(30);
  });
});

describe("Safety rails", () => {
  it("suppresses any adjustment when there is nothing to charge on", () => {
    expect(constrainAdjustment(50, 0)).toEqual({ amount: 0, capped: "suppressed" });
  });

  it("never lets a discount exceed the invoice's own charges", () => {
    expect(constrainAdjustment(-5000, 3000)).toEqual({ amount: -3000, capped: "discount" });
  });

  it("caps a surcharge at the configured percent of the invoice", () => {
    expect(constrainAdjustment(200, 1000, 10)).toEqual({ amount: 100, capped: "surcharge", ceiling: 100 });
  });

  it("leaves an in-range adjustment alone", () => {
    expect(constrainAdjustment(30, 1000)).toEqual({ amount: 30, capped: null });
  });
});

describe("Chargeability", () => {
  const items: LineItem[] = [
    { id: "a", label: "VPS Hosting", type: "product", key: "12", amount: 2000, taxed: true },
    { id: "b", label: "Domain", type: "tld", key: ".in", amount: 799, taxed: true },
    { id: "c", label: "Addon", type: "addon", key: "4", amount: 299, taxed: true },
  ];

  it("prorates the tax component by the chargeable share", () => {
    const base = computeChargeableBase(items, (i) => i.type !== "addon", 100);
    expect(base.rawSubtotal).toBe(3098);
    expect(base.chargeableSubtotal).toBe(2799);
    expect(base.chargeableTotal).toBe(2889.35);
    expect(base.blocked).toBe(false);
  });

  it("blocks entirely when every item is excluded", () => {
    const base = computeChargeableBase(items, () => false, 100);
    expect(base.blocked).toBe(true);
    expect(base.reason).toMatch(/No chargeable invoice items/);
  });

  it("blocks on an excluded client without touching item flags", () => {
    const base = computeChargeableBase(items, () => true, 100, false);
    expect(base.blocked).toBe(true);
    expect(base.reason).toBe("Client excluded from gateway charges.");
    expect(base.chargeableSubtotal).toBe(0);
  });

  it("reports each item's share of the fee base", () => {
    const base = computeChargeableBase(items, () => true, 0);
    const shares = base.contributions.map((c) => Math.round(c.share * 1000) / 1000);
    expect(shares).toEqual([0.646, 0.258, 0.097]);
  });
});

describe("Condition matching — AND only, first failure wins", () => {
  const conditions: Condition[] = [
    { type: "client_country", operator: "equals", value: "IN" },
    { type: "client_currency", operator: "equals", value: "USD" },
    { type: "billing_cycle", operator: "equals", value: "monthly" },
  ];

  it("stops evaluating at the first failing condition", () => {
    const { matched, results } = evaluateConditions(conditions, context());
    expect(matched).toBe(false);
    expect(results).toHaveLength(2); // never reached billing_cycle
  });

  it("matches case-insensitively", () => {
    const { matched } = evaluateConditions(
      [{ type: "client_country", operator: "equals", value: "in" }],
      context(),
    );
    expect(matched).toBe(true);
  });

  it("treats a missing signal as an empty string", () => {
    const { matched } = evaluateConditions(
      [{ type: "promo_code", operator: "contains", value: "SAVE" }],
      context(),
    );
    expect(matched).toBe(false);
  });

  it("supports the engine-level operators the admin UI cannot reach", () => {
    const ctx = context({ subtotal: 2500 });
    expect(evaluateConditions([{ type: "subtotal", operator: "between", value: "1000,3000" }], ctx).matched).toBe(true);
    expect(evaluateConditions([{ type: "client_country", operator: "in", value: "IN,LK,NP" }], ctx).matched).toBe(true);
  });
});

describe("RuleEngine — exclusive, highest priority wins", () => {
  const base = computeChargeableBase(
    [{ id: "a", label: "VPS", type: "product", key: "12", amount: 1000, taxed: false }],
    () => true,
    0,
  );

  it("stops at the first match and marks later matches superseded", () => {
    const low = rule({ id: 1, name: "Low", priority: 10, percentageAmount: 5 });
    const high = rule({ id: 2, name: "High", priority: 90, percentageAmount: 2 });
    const result = evaluate([low, high], context(), gateway(), base);

    expect(result.winner?.rule.name).toBe("High");
    expect(result.amount).toBe(20);
    expect(result.outcomes.find((o) => o.rule.name === "Low")?.skipped).toBe("superseded");
  });

  it("returns nothing when the client is excluded", () => {
    const blocked = computeChargeableBase([], () => true, 0, false);
    const result = evaluate([rule()], context(), gateway(), blocked);
    expect(result.blocked).toBe(true);
    expect(result.amount).toBe(0);
  });

  it("ignores rules belonging to another gateway", () => {
    const other = rule({ id: 5, gateway: "payu" });
    const result = evaluate([other], context(), gateway(), base);
    expect(result.winner).toBeNull();
    expect(result.outcomes[0].skipped).toBe("other-gateway");
  });

  it("evaluates nothing while the gateway is disabled", () => {
    const result = evaluate([rule()], context(), gateway({ enabled: false }), base);
    expect(result.winner).toBeNull();
    expect(result.outcomes[0].skipped).toBe("gateway-disabled");
  });

  it("removes an adjustment that rounds away to dust", () => {
    const tiny = rule({ feeType: "fixed", fixedAmount: 0.001 });
    const result = evaluate([tiny], context(), gateway(), base);
    expect(result.removedAsDust).toBe(true);
    expect(result.amount).toBe(0);
  });

  it("caps a runaway surcharge at the invoice ceiling", () => {
    const huge = rule({ percentageAmount: 90 });
    const result = evaluate([huge], context(), gateway(), base, 10);
    expect(result.capped).toBe("surcharge");
    expect(result.amount).toBe(100);
  });
});
