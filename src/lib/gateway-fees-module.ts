/**
 * Audited capability data for the Gateway Fees & Allocator product page.
 *
 * Source of truth is the module itself, at
 *   portal.shrotihost.in/modules/addons/shrotihost_smart_gateway_fees
 * Every entry carries the file:line it was read from. If you cannot cite it,
 * it does not go on the page — see the notSupported list below for the claims
 * this module specifically cannot make.
 *
 * Verified 2026-08-25 against a tree that was being edited during the audit;
 * re-check `hooks.php` and `Calculator.php` before changing any number here.
 */

import type { CurrencyCode } from "@/lib/currency";
import { storeGroupUrl } from "@/lib/whmcs";

/* -------------------------------------------------------------------------- */
/* Context signals — ContextBuilder.php:23-36                                   */
/* -------------------------------------------------------------------------- */

export type SignalGroup = "customer" | "payment" | "commerce";

export type ContextSignal = {
  key: string;
  /** The module's own label, from the admin UI where one exists. */
  label: string;
  group: SignalGroup;
  /** Whether a rule can actually match on it (RuleRepository.php:15-28). */
  matchable: boolean;
  detail: string;
};

export const contextSignals: ContextSignal[] = [
  { key: "client_id", label: "Specific Client ID", group: "customer", matchable: true, detail: "Targets one account by its WHMCS client ID." },
  { key: "client_group", label: "Client Group", group: "customer", matchable: true, detail: "Any client group defined in WHMCS." },
  { key: "client_country", label: "Country", group: "customer", matchable: true, detail: "Include one country, or every country except one." },
  { key: "client_currency", label: "Client Currency", group: "customer", matchable: true, detail: "The currency on the client's account." },

  { key: "gateway", label: "Gateway", group: "payment", matchable: true, detail: "Read live from your WHMCS payment gateways — none are hardcoded." },
  { key: "tax_enabled", label: "Tax Enabled", group: "payment", matchable: true, detail: "Whether tax applies to this invoice at all." },
  { key: "currency_code", label: "Invoice Currency", group: "payment", matchable: false, detail: "Carried through the calculation, but not matchable on its own." },

  { key: "subtotal", label: "Subtotal", group: "commerce", matchable: true, detail: "Minimum and maximum bounds, on the chargeable portion." },
  { key: "total", label: "Total", group: "commerce", matchable: true, detail: "Minimum and maximum bounds, tax included." },
  { key: "billing_cycle", label: "Billing Cycle", group: "commerce", matchable: true, detail: "Monthly through triennially, plus one-time." },
  { key: "invoice_type", label: "Invoice Type", group: "commerce", matchable: true, detail: "Standard, renewal, add funds, manual, or cart preview." },
  { key: "is_renewal", label: "Renewal Only", group: "commerce", matchable: true, detail: "Separates renewals from first orders." },
  { key: "promo_code", label: "Promo Code Contains", group: "commerce", matchable: true, detail: "Substring match against the applied promo code." },
  { key: "invoice_id", label: "Invoice ID", group: "commerce", matchable: false, detail: "Identifies the invoice for logging and snapshots." },
];

export const signalGroupLabels: Record<SignalGroup, string> = {
  customer: "Customer",
  payment: "Payment",
  commerce: "Commerce",
};

/* -------------------------------------------------------------------------- */
/* Operators — RuleRepository.php:29                                            */
/* -------------------------------------------------------------------------- */

export const operators = [
  { key: "equals", label: "equals", ui: true },
  { key: "not_equals", label: "is not", ui: true },
  { key: "contains", label: "contains", ui: true },
  { key: "gte", label: "at least", ui: true },
  { key: "lte", label: "at most", ui: true },
  { key: "in", label: "is one of", ui: false },
  { key: "not_in", label: "is none of", ui: false },
  { key: "gt", label: "above", ui: false },
  { key: "lt", label: "below", ui: false },
  { key: "between", label: "between", ui: false },
] as const;

/* -------------------------------------------------------------------------- */
/* WHMCS integration — hooks.php (11 hooks, verified by direct read)            */
/* -------------------------------------------------------------------------- */

export type HookEntry = {
  name: string;
  surface: "invoice" | "cart" | "client" | "system";
  detail: string;
};

export const hooks: HookEntry[] = [
  { name: "InvoiceCreated", surface: "invoice", detail: "Applies the charge to a new invoice — deferring while the order is still pending, so a cart invoice is only touched once." },
  { name: "InvoiceChangeGateway", surface: "invoice", detail: "Recalculates from scratch when the payment method changes." },
  { name: "UpdateInvoiceTotal", surface: "invoice", detail: "Re-checks after line items change, so the charge is never left stranded on an invoice with nothing behind it." },
  { name: "AfterShoppingCartCheckout", surface: "cart", detail: "Runs early (priority −10) on the invoice the cart just produced." },
  { name: "InvoicePaid", surface: "invoice", detail: "Logs only. The snapshot is deliberately left intact as history — nothing is mutated after payment." },
  { name: "DailyCronJob", surface: "system", detail: "Rebuilds the daily rollup and purges logs past their retention window." },
  { name: "ClientAreaHeadOutput", surface: "cart", detail: "Loads the checkout stylesheet, on the cart page only." },
  { name: "ClientAreaPage", surface: "client", detail: "Validates the WHMCS CSRF token before any gateway change is accepted." },
  { name: "ClientAreaPageViewInvoice", surface: "invoice", detail: "Filters the invoice's gateway list by your allocation rules and re-applies the charge if the selection moves." },
  { name: "ClientAreaFooterOutput", surface: "cart", detail: "Publishes the allocation map and a signed preview token to the checkout page." },
  { name: "ShoppingCartCheckoutOutput", surface: "cart", detail: "Renders the live charge preview into the order summary." },
];

/* -------------------------------------------------------------------------- */
/* Admin surface — controllers/Admin/*, templates/*                             */
/* -------------------------------------------------------------------------- */

export const adminPages = [
  { name: "Gateways", inNav: true, detail: "Every gateway WHMCS has detected, with its rule count, billing type and allocation summary." },
  { name: "Gateway", inNav: false, detail: "One gateway: enable it, set its billing type, and manage its rules without leaving the page." },
  { name: "Allocation", inNav: true, detail: "The five allocation rule types, per gateway, across six tabs." },
  { name: "Rules", inNav: false, detail: "The same rules across every gateway, with charge logic and targeting in one table." },
  { name: "Tier Steps", inNav: false, detail: "Amount tiers for a rule — the charge changes with the invoice size." },
  { name: "Items", inNav: true, detail: "Products, addons, TLDs and invoice types, each switchable in or out of the fee base." },
  { name: "Clients", inNav: true, detail: "Per-account exceptions for the operational edge cases." },
  { name: "Logs", inNav: true, detail: "Twenty-two named events as a filterable stream, with the full context payload." },
  { name: "Settings", inNav: true, detail: "Labels and merge fields, tax defaults, retention, checkout colours, theme integration." },
] as const;

/* -------------------------------------------------------------------------- */
/* Allocation — templates/allocation.php:69-70, ModuleHelper.php:753-803        */
/* -------------------------------------------------------------------------- */

export const allocationRuleTypes = [
  { key: "country", label: "Country", detail: "Show a gateway only in chosen countries, or everywhere except them." },
  { key: "currency", label: "Currency", detail: "Restrict a gateway to the currencies it actually settles in." },
  { key: "client_group", label: "Client Group", detail: "Reserve a gateway for resellers, staff, or any WHMCS group." },
  { key: "order_value", label: "Order Value", detail: "Minimum and maximum order amount for the gateway to appear." },
  { key: "products", label: "Products / Services", detail: "Products, product groups, addons and domain TLDs — any match shows the gateway." },
] as const;

export const itemTypes = [
  { key: "product", label: "Products", detail: "Every service product WHMCS has." },
  { key: "addon", label: "Addons", detail: "Configurable addon billing targets." },
  { key: "tld", label: "Domain TLDs", detail: "Matched by extension." },
  { key: "other", label: "Other", detail: "Add funds, late fees, custom invoices and upgrades." },
] as const;

export const billingTypes = [
  { key: "standard", label: "Standard", detail: "The charge is added on top. Right for almost every gateway." },
  { key: "alternative", label: "Alternative", detail: "Grosses up so the amount survives the gateway's own percentage cut." },
  { key: "paypalv2", label: "PayPalV2", detail: "Grosses up the base and the fixed component together." },
] as const;

/* -------------------------------------------------------------------------- */
/* Commercial — verified in WHMCS (tblproducts 62, tblpricing currency 1/2/3)   */
/* -------------------------------------------------------------------------- */

/** Real WHMCS catalogue prices, not a marketing-side conversion of the rupee figure. */
export const pricing: { label: string; period: string; amounts: Record<CurrencyCode, number> }[] = [
  { label: "Monthly", period: "/mo", amounts: { INR: 199, USD: 2.08, EUR: 1.78 } },
  { label: "Quarterly", period: "/quarter", amounts: { INR: 499, USD: 5.21, EUR: 4.47 } },
  { label: "Annual", period: "/year", amounts: { INR: 1999, USD: 20.87, EUR: 17.89 } },
];

export const currencySymbols: Record<CurrencyCode, string> = { INR: "₹", USD: "$", EUR: "€" };

/** The Modules store group, UTM-tagged like every other CTA on the site. The
 *  product's own deep link is broken upstream (empty slug in WHMCS), so the
 *  group page is what actually resolves — verified, not assumed. */
export const STORE_URL = storeGroupUrl("modules");
export const PRODUCT_NAME = "Smart Gateway Fees And Gateway Allocator for WHMCS";

/* -------------------------------------------------------------------------- */
/* Honesty guardrails                                                           */
/* -------------------------------------------------------------------------- */

/** Verified absent in code. Nothing on the page may imply any of these. */
export const notSupported = [
  "Currency conversion of fee amounts — a fixed amount is the same number in every currency",
  "Date, schedule or time-window rules",
  "Product as a fee-rule condition (products steer gateway allocation and the fee base, not the rate)",
  "OR logic, condition groups or nesting — matching is AND-only",
  "Stacking several rules on one invoice",
  "Per-client custom rates — client exceptions are on/off",
  "Server-enforced gateway hiding at checkout — enforcement is on the invoice",
  "Reporting dashboards or charts",
  "Rule import, export, cloning or versioning",
  "Changing invoice status",
  "Translations — the module ships English only",
];

export const faq: { q: string; a: string }[] = [
  {
    q: "What does Gateway Fees & Allocator actually do?",
    a: "Two things. It adds a charge or a discount to an invoice based on which payment method the customer picked and the context around that invoice — and it controls which payment methods are offered in the first place. Both are configured from the WHMCS admin area; no template or checkout code is written by you.",
  },
  {
    q: "Which payment gateways are supported?",
    a: "Whichever ones your WHMCS has. The module reads your active gateways directly from WHMCS and hardcodes none, so a gateway you add later appears on its own. What you do choose per gateway is a billing model: Standard adds the charge on top, while Alternative and PayPalV2 gross it up so the amount survives the gateway's own percentage cut.",
  },
  {
    q: "How is the charge calculated?",
    a: "A rule is a fixed amount, a percentage, or both. The base is the invoice subtotal, or the tax-inclusive total if you set the gateway to charge after taxing. Optional tier steps change the amount once the invoice passes a threshold, and each rule can carry a minimum and maximum cap. The result is rounded to two decimals.",
  },
  {
    q: "What conditions can a rule depend on?",
    a: "Twelve: gateway, client, client group, country, client currency, billing cycle, invoice type, renewal state, promo code, tax state, and subtotal and total bounds. Conditions combine with AND — every one has to match. There is no OR and no nesting.",
  },
  {
    q: "Can rules depend on products?",
    a: "Not for the rate. Products, product groups, addons and TLDs decide two other things: which gateways are shown at all, and which line items count toward the fee base. So a product can remove itself from the charge, or hide a gateway — but it cannot change the percentage.",
  },
  {
    q: "Can rules depend on currency?",
    a: "Yes — a rule can require a particular client currency. One thing to be clear about: the module does not convert between currencies. A fixed amount of 5 is 5 units in every currency, so multi-currency stores usually express fee rules as percentages and reserve fixed amounts for a single-currency gateway.",
  },
  {
    q: "Can individual clients be excluded?",
    a: "Yes, per account, as a switch. An excluded client is skipped before any rule is evaluated and the reason is logged. It is an on/off exception rather than a custom rate — there is no per-client percentage.",
  },
  {
    q: "What does the customer see?",
    a: "At checkout, a line in the order summary showing the charge or discount and an updated total, previewed live as they change payment method. On the invoice, an ordinary WHMCS line item. Both labels are templates you control, with merge fields like {gateway_name} and {percentage_suffix}.",
  },
  {
    q: "Does it change my invoices or their status?",
    a: "It owns exactly one line item per invoice, marked so it can always be found again, and it asks WHMCS itself to recalculate the totals. It never changes invoice status, and it never touches a Paid, Cancelled or Collections invoice. Whether that line is taxed depends on your setting and on whether anything else on the invoice is taxed.",
  },
  {
    q: "Where is it configured?",
    a: "Inside WHMCS, under Addons. Six tabs: Gateways, Allocation, Items, Clients, Logs and Settings. The only thing entered in WHMCS's own addon settings screen is the licence key.",
  },
  {
    q: "How do I see what it did?",
    a: "Every calculation is stored as a snapshot with the rule and the full context as it was at the time, and twenty-two named events are written to a filterable log with the raw payload attached. Errors are mirrored into the WHMCS module log. Log retention is configurable.",
  },
  {
    q: "What are the requirements?",
    a: "A WHMCS installation you can add addon modules to, and a licence key, which is validated per installation. If the licence is inactive the module stays completely dormant — no hooks are registered and nothing on your invoices changes.",
  },
];
