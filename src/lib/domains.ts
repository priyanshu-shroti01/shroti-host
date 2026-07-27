/**
 * Sourced from https://portal.shrotihost.in/index.php/domain/pricing (66 TLDs,
 * captured 27 Jul 2026). Prices are 1-year registration in INR unless
 * `termYears` says otherwise. Keep this in sync manually when pricing changes —
 * this environment can't reach the portal directly to re-fetch it.
 */
export type DomainCategory =
  | "Popular"
  | "Business"
  | "Technology"
  | "Shopping"
  | "Novelty"
  | "Money and Finance"
  | "Sports"
  | "Arts and Entertainment"
  | "Food and Drink"
  | "Other";

export type DomainBadge = "Hot!" | "Sale!" | "New!";

export type DomainPrice = {
  tld: string;
  category: DomainCategory;
  registerInr: number;
  transferInr: number;
  renewInr: number;
  /** Term length the above prices cover. Defaults to 1 when omitted. */
  termYears?: number;
  badge?: DomainBadge;
};

export const allDomains: DomainPrice[] = [
  { tld: ".com", category: "Popular", registerInr: 1169, transferInr: 1234, renewInr: 1299, badge: "Hot!" },
  { tld: ".in", category: "Other", registerInr: 714, transferInr: 779, renewInr: 779, badge: "Hot!" },
  { tld: ".xyz", category: "Popular", registerInr: 259, transferInr: 2079, renewInr: 2079, badge: "Sale!" },
  { tld: ".online", category: "Popular", registerInr: 259, transferInr: 4549, renewInr: 4549 },
  { tld: ".co.in", category: "Other", registerInr: 649, transferInr: 779, renewInr: 779 },
  { tld: ".org", category: "Popular", registerInr: 1039, transferInr: 1559, renewInr: 1559 },
  { tld: ".net", category: "Popular", registerInr: 1299, transferInr: 1429, renewInr: 1559 },
  { tld: ".biz", category: "Popular", registerInr: 1039, transferInr: 2469, renewInr: 2469 },
  { tld: ".shop", category: "Shopping", registerInr: 129, transferInr: 3639, renewInr: 5199 },
  { tld: ".blog", category: "Popular", registerInr: 1169, transferInr: 3249, renewInr: 3249 },
  { tld: ".buzz", category: "Other", registerInr: 454, transferInr: 4679, renewInr: 4679 },
  { tld: ".cc", category: "Other", registerInr: 649, transferInr: 1299, renewInr: 1299 },
  { tld: ".cfd", category: "Money and Finance", registerInr: 649, transferInr: 1429, renewInr: 1429 },
  { tld: ".club", category: "Popular", registerInr: 519, transferInr: 2079, renewInr: 2079 },
  { tld: ".co", category: "Other", registerInr: 519, transferInr: 3379, renewInr: 3379 },
  { tld: ".com.in", category: "Other", registerInr: 649, transferInr: 779, renewInr: 779 },
  { tld: ".fun", category: "Novelty", registerInr: 129, transferInr: 3899, renewInr: 3899 },
  { tld: ".icu", category: "Popular", registerInr: 389, transferInr: 2079, renewInr: 2079 },
  { tld: ".in.net", category: "Other", registerInr: 220, transferInr: 779, renewInr: 909, badge: "New!" },
  { tld: ".info", category: "Popular", registerInr: 519, transferInr: 2989, renewInr: 2989 },
  { tld: ".io", category: "Popular", registerInr: 4289, transferInr: 7994, renewInr: 7994 },
  { tld: ".live", category: "Other", registerInr: 454, transferInr: 4679, renewInr: 4679 },
  { tld: ".me", category: "Popular", registerInr: 1429, transferInr: 2729, renewInr: 2729 },
  { tld: ".nl", category: "Popular", registerInr: 1949, transferInr: 1949, renewInr: 1949 },
  { tld: ".one", category: "Novelty", registerInr: 1169, transferInr: 3564, renewInr: 3564 },
  { tld: ".org.in", category: "Other", registerInr: 649, transferInr: 779, renewInr: 779 },
  { tld: ".pro", category: "Other", registerInr: 519, transferInr: 3899, renewInr: 3899 },
  { tld: ".pw", category: "Business", registerInr: 298, transferInr: 1949, renewInr: 3249, badge: "Sale!" },
  { tld: ".review", category: "Other", registerInr: 1884, transferInr: 1884, renewInr: 1884 },
  { tld: ".sbs", category: "Other", registerInr: 909, transferInr: 1429, renewInr: 1429 },
  { tld: ".site", category: "Popular", registerInr: 129, transferInr: 4549, renewInr: 4549 },
  { tld: ".space", category: "Other", registerInr: 129, transferInr: 5199, renewInr: 5199 },
  { tld: ".store", category: "Shopping", registerInr: 389, transferInr: 7474, renewInr: 7474 },
  { tld: ".team", category: "Sports", registerInr: 779, transferInr: 5199, renewInr: 5199 },
  { tld: ".tech", category: "Technology", registerInr: 1104, transferInr: 8384, renewInr: 8384 },
  { tld: ".top", category: "Popular", registerInr: 389, transferInr: 909, renewInr: 909 },
  { tld: ".uk", category: "Popular", registerInr: 1039, transferInr: 1039, renewInr: 1039 },
  { tld: ".us", category: "Popular", registerInr: 649, transferInr: 974, renewInr: 1039 },
  { tld: ".website", category: "Technology", registerInr: 1169, transferInr: 2599, renewInr: 2599 },
  { tld: ".app", category: "Technology", registerInr: 1169, transferInr: 2469, renewInr: 2534 },
  { tld: ".it.com", category: "Other", registerInr: 454, transferInr: 3119, renewInr: 3119 },
  { tld: ".co.uk", category: "Popular", registerInr: 1039, transferInr: 1039, renewInr: 1039 },
  { tld: ".net.in", category: "Other", registerInr: 649, transferInr: 779, renewInr: 779 },
  { tld: ".art", category: "Arts and Entertainment", registerInr: 779, transferInr: 3249, renewInr: 3249 },
  { tld: ".asia", category: "Other", registerInr: 649, transferInr: 2079, renewInr: 2079 },
  { tld: ".at", category: "Other", registerInr: 1754, transferInr: 1819, renewInr: 1819 },
  { tld: ".baby", category: "Other", registerInr: 324, transferInr: 9294, renewInr: 9294 },
  { tld: ".beauty", category: "Other", registerInr: 324, transferInr: 2274, renewInr: 2274 },
  { tld: ".beer", category: "Food and Drink", registerInr: 259, transferInr: 4484, renewInr: 4484 },
  { tld: ".best", category: "Novelty", registerInr: 324, transferInr: 2794, renewInr: 2794 },
  { tld: ".bond", category: "Money and Finance", registerInr: 207, transferInr: 2274, renewInr: 2274 },
  { tld: ".business", category: "Business", registerInr: 454, transferInr: 2794, renewInr: 2794 },
  { tld: ".cafe", category: "Food and Drink", registerInr: 779, transferInr: 7409, renewInr: 7409 },
  { tld: ".click", category: "Technology", registerInr: 259, transferInr: 2079, renewInr: 2079 },
  { tld: ".com.np", category: "Other", registerInr: 39000, transferInr: 39000, renewInr: 39000 },
  { tld: ".eu", category: "Popular", registerInr: 649, transferInr: 1169, renewInr: 1169 },
  { tld: ".travel.in", category: "Other", registerInr: 649, transferInr: 779, renewInr: 779 },
  { tld: ".wiki", category: "Other", registerInr: 389, transferInr: 3769, renewInr: 3769 },
  { tld: ".win", category: "Novelty", registerInr: 779, transferInr: 779, renewInr: 974 },
  { tld: ".ec.cc", category: "Other", registerInr: 454, transferInr: 779, renewInr: 779 },
  { tld: ".edu.np", category: "Other", registerInr: 39000, transferInr: 39000, renewInr: 39000 },
  { tld: ".eu.cc", category: "Other", registerInr: 116, transferInr: 519, renewInr: 519 },
  { tld: ".gu.cc", category: "Other", registerInr: 129, transferInr: 519, renewInr: 519 },
  { tld: ".uk.cc", category: "Other", registerInr: 649, transferInr: 1169, renewInr: 1169 },
  { tld: ".us.cc", category: "Other", registerInr: 64, transferInr: 1169, renewInr: 1169, badge: "Sale!" },
  { tld: ".ai", category: "Other", registerInr: 22099, transferInr: 22099, renewInr: 22099, termYears: 2 },
];

export const domainCategories: DomainCategory[] = [
  "Popular",
  "Business",
  "Technology",
  "Shopping",
  "Novelty",
  "Money and Finance",
  "Sports",
  "Arts and Entertainment",
  "Food and Drink",
  "Other",
];

/** Suggestion prefixes/suffixes used to generate query ideas — not availability claims. */
export const suggestionVariants = [
  (base: string) => `${base}.com`,
  (base: string) => `${base}.in`,
  (base: string) => `get${base}.com`,
  (base: string) => `try${base}.com`,
  (base: string) => `${base}.app`,
  (base: string) => `${base}.io`,
];
