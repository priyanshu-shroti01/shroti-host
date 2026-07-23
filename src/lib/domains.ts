/** Sourced from https://portal.shrotihost.in/index.php/domain/pricing — 1-year registration, INR. */
export type DomainCategory = "Popular" | "Business" | "Tech" | "Store";
export type DomainPrice = { tld: string; registerInr: number; renewInr: number; category: DomainCategory };

export const popularDomains: DomainPrice[] = [
  { tld: ".com", registerInr: 1169, renewInr: 1299, category: "Popular" },
  { tld: ".in", registerInr: 714, renewInr: 779, category: "Popular" },
  { tld: ".org", registerInr: 1039, renewInr: 1559, category: "Business" },
  { tld: ".net", registerInr: 1299, renewInr: 1559, category: "Business" },
  { tld: ".co", registerInr: 2209, renewInr: 3379, category: "Business" },
  { tld: ".xyz", registerInr: 259, renewInr: 2079, category: "Tech" },
  { tld: ".online", registerInr: 259, renewInr: 4549, category: "Tech" },
  { tld: ".tech", registerInr: 1104, renewInr: 8384, category: "Tech" },
  { tld: ".app", registerInr: 1169, renewInr: 2534, category: "Tech" },
  { tld: ".shop", registerInr: 129, renewInr: 5199, category: "Store" },
];

export const domainCategories: DomainCategory[] = ["Popular", "Business", "Tech", "Store"];

/** Suggestion prefixes/suffixes used to generate query ideas — not availability claims. */
export const suggestionVariants = [
  (base: string) => `${base}.com`,
  (base: string) => `${base}.in`,
  (base: string) => `get${base}.com`,
  (base: string) => `try${base}.com`,
  (base: string) => `${base}.app`,
  (base: string) => `${base}.io`,
];
