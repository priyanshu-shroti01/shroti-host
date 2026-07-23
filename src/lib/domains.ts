/** Sourced from https://portal.shrotihost.in/index.php/domain/pricing — 1-year registration, INR. */
export type DomainPrice = { tld: string; registerInr: number; renewInr: number };

export const popularDomains: DomainPrice[] = [
  { tld: ".com", registerInr: 1169, renewInr: 1299 },
  { tld: ".in", registerInr: 714, renewInr: 779 },
  { tld: ".xyz", registerInr: 259, renewInr: 2079 },
  { tld: ".online", registerInr: 259, renewInr: 4549 },
  { tld: ".org", registerInr: 1039, renewInr: 1559 },
  { tld: ".net", registerInr: 1299, renewInr: 1559 },
  { tld: ".tech", registerInr: 1104, renewInr: 8384 },
  { tld: ".app", registerInr: 1169, renewInr: 2534 },
  { tld: ".co", registerInr: 2209, renewInr: 3379 },
  { tld: ".shop", registerInr: 129, renewInr: 5199 },
];
