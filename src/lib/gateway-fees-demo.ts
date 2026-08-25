/**
 * Fixture configuration for the on-page demo.
 *
 * These are an EXAMPLE WHMCS setup, not a claim about anyone's install: the
 * module hardcodes no gateway and reads whatever WHMCS has. What is real here
 * is the shape — every field, operator, billing type and cap below exists in
 * the module, and the numbers are produced by gateway-fee-calc.ts, which is a
 * line-for-line port of Calculator.php. Nothing is illustrated by hand.
 */

import type { CurrencyCode } from "@/lib/currency";
import type { GatewayConfig, LineItem, Rule } from "@/lib/gateway-fee-calc";

export const demoGateways: GatewayConfig[] = [
  {
    key: "razorpay",
    name: "Razorpay",
    enabled: true,
    billingType: "standard",
    chargeAfterTaxing: false,
    applyTaxToCharge: true,
  },
  {
    key: "payu",
    name: "PayU",
    enabled: true,
    billingType: "standard",
    chargeAfterTaxing: true,
    applyTaxToCharge: true,
  },
  {
    key: "paypal",
    name: "PayPal",
    enabled: true,
    billingType: "paypalv2",
    chargeAfterTaxing: false,
    applyTaxToCharge: false,
  },
  {
    key: "banktransfer",
    name: "Bank Transfer",
    enabled: true,
    billingType: "standard",
    chargeAfterTaxing: false,
    applyTaxToCharge: false,
  },
];

/**
 * Four rules across the example gateways. Priority order matters: the engine
 * is exclusive, so the highest-priority match wins and evaluation stops there.
 */
export const demoRules: Rule[] = [
  {
    id: 1,
    name: "Reseller rate",
    gateway: "razorpay",
    status: "active",
    adjustmentMode: "surcharge",
    feeType: "percentage",
    fixedAmount: 0,
    percentageAmount: 1.5,
    minimumAmount: null,
    maximumAmount: null,
    priority: 90,
    label: "Gateway Fee",
    conditions: [
      { type: "gateway", operator: "equals", value: "razorpay" },
      { type: "client_group", operator: "equals", value: "Reseller" },
    ],
    steps: [],
  },
  {
    id: 2,
    name: "Domestic cards",
    gateway: "razorpay",
    status: "active",
    adjustmentMode: "surcharge",
    feeType: "percentage",
    fixedAmount: 0,
    percentageAmount: 2,
    minimumAmount: null,
    // Above a large invoice the percentage would run away; cap the magnitude.
    maximumAmount: 250,
    priority: 70,
    conditions: [
      { type: "gateway", operator: "equals", value: "razorpay" },
      { type: "client_country", operator: "equals", value: "IN" },
    ],
    steps: [],
  },
  {
    id: 3,
    name: "Standard rate",
    gateway: "razorpay",
    status: "active",
    adjustmentMode: "surcharge",
    feeType: "mixed",
    fixedAmount: 3,
    percentageAmount: 2.5,
    minimumAmount: null,
    maximumAmount: null,
    priority: 30,
    conditions: [{ type: "gateway", operator: "equals", value: "razorpay" }],
    steps: [],
  },
  {
    id: 4,
    name: "PayU tiered",
    gateway: "payu",
    status: "active",
    adjustmentMode: "surcharge",
    feeType: "percentage",
    fixedAmount: 0,
    percentageAmount: 2.4,
    minimumAmount: null,
    maximumAmount: null,
    priority: 60,
    conditions: [{ type: "gateway", operator: "equals", value: "payu" }],
    // The rate drops once the invoice is large enough to be worth it.
    steps: [
      { id: 1, minInvoiceAmount: 0, fixedAmount: 0, percentageAmount: 2.4, status: "active", sortOrder: 100 },
      { id: 2, minInvoiceAmount: 2500, fixedAmount: 0, percentageAmount: 1.8, status: "active", sortOrder: 100 },
    ],
  },
  {
    id: 5,
    name: "Cross-border",
    gateway: "paypal",
    status: "active",
    adjustmentMode: "surcharge",
    feeType: "mixed",
    fixedAmount: 30,
    percentageAmount: 4.4,
    minimumAmount: null,
    maximumAmount: null,
    priority: 80,
    conditions: [{ type: "gateway", operator: "equals", value: "paypal" }],
    steps: [],
  },
  {
    id: 6,
    name: "Bank transfer incentive",
    gateway: "banktransfer",
    status: "active",
    adjustmentMode: "discount",
    feeType: "percentage",
    fixedAmount: 0,
    percentageAmount: 1,
    minimumAmount: null,
    maximumAmount: null,
    priority: 50,
    label: "Bank Transfer Discount",
    conditions: [{ type: "gateway", operator: "equals", value: "banktransfer" }],
    steps: [],
  },
];

/**
 * Invoice presets per currency. A real store prices per currency in WHMCS —
 * and showing the same figure across all three would misrepresent that. The
 * rules' FIXED components deliberately stay the same number in every currency,
 * because that is exactly what the module does: it never converts.
 */
export const demoInvoices: Record<CurrencyCode, LineItem[]> = {
  INR: [
    { id: "vps", label: "VPS Hosting — 4 vCPU", type: "product", key: "12", amount: 2000, taxed: true },
    { id: "domain", label: "Domain renewal — .in", type: "tld", key: ".in", amount: 799, taxed: true },
    { id: "addon", label: "Daily Backups addon", type: "addon", key: "4", amount: 299, taxed: true },
    { id: "latefee", label: "Late fee", type: "other", key: "latefee", amount: 150, taxed: false },
  ],
  USD: [
    { id: "vps", label: "VPS Hosting — 4 vCPU", type: "product", key: "12", amount: 24, taxed: true },
    { id: "domain", label: "Domain renewal — .com", type: "tld", key: ".com", amount: 12, taxed: true },
    { id: "addon", label: "Daily Backups addon", type: "addon", key: "4", amount: 4, taxed: true },
    { id: "latefee", label: "Late fee", type: "other", key: "latefee", amount: 2, taxed: false },
  ],
  EUR: [
    { id: "vps", label: "VPS Hosting — 4 vCPU", type: "product", key: "12", amount: 22, taxed: true },
    { id: "domain", label: "Domain renewal — .eu", type: "tld", key: ".eu", amount: 11, taxed: true },
    { id: "addon", label: "Daily Backups addon", type: "addon", key: "4", amount: 3.5, taxed: true },
    { id: "latefee", label: "Late fee", type: "other", key: "latefee", amount: 2, taxed: false },
  ],
};

export const demoClientGroups = ["Default", "Reseller", "Staff"];
export const demoCountries = [
  { code: "IN", label: "India" },
  { code: "US", label: "United States" },
  { code: "DE", label: "Germany" },
  { code: "AE", label: "United Arab Emirates" },
];
export const demoBillingCycles = [
  { value: "monthly", label: "Monthly" },
  { value: "annually", label: "Annually" },
  { value: "onetime", label: "One Time" },
];

/** Tax as a share of the chargeable subtotal, for the preset invoices. */
export const DEMO_TAX_RATE = 0.18;
