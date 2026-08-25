/**
 * WHMCS (portal.shrotihost.in) storefront URLs.
 *
 * Plain module on purpose — it is imported by server components (pages) AND
 * client components. Never move these into a "use client" file: non-component
 * exports from client modules arrive on the server as client-reference stubs,
 * and every prop built from them silently becomes undefined.
 */
import { withUtm } from "@/lib/analytics";

export const WHMCS_PORTAL = "https://portal.shrotihost.in";
export const WHMCS_STORE = `${WHMCS_PORTAL}/index.php/store`;

/**
 * Store groups as they exist in WHMCS. Each hosting line deep-links to its own
 * group so the shopper lands on the catalog they were just reading, not the
 * generic cart.
 *
 * These are path prefixes that `productUrl` extends, so they stay un-tagged
 * here; campaign parameters are appended on the final URL.
 */
export const storeGroups = {
  shared: `${WHMCS_STORE}/shared-hosting`,
  wordpress: `${WHMCS_STORE}/wordpress-hosting`,
  unlimited: `${WHMCS_STORE}/unlimited-hosting`,
  reseller: `${WHMCS_STORE}/reseller-hosting`,
  masterReseller: `${WHMCS_STORE}/master-reseller`,
  alphaReseller: `${WHMCS_STORE}/alpha-reseller-hosting`,
  // WHMCS addon modules. Deep links to individual module products do not
  // resolve (the products have no slug set in WHMCS, so the friendly-URL
  // rewrite falls through to shared hosting) — link the group, not the product.
  modules: `${WHMCS_STORE}/modules`,
} as const;

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/**
 * Direct product URL for a plan inside a store group, tagged with UTM
 * parameters so GA4 can attribute the order to the site (utm_content is
 * `<group>-<plan>`, e.g. `shared-hosting-gold`). WHMCS product slugs are
 * the lower-cased plan names (bronze / gold / platinum / diamond), kept in
 * sync by /home/shrotihost/whmcs-tools/sync-products.php.
 */
export function productUrl(group: string, planName: string): string {
  const plan = slugify(planName);
  const groupSlug = group.split("/").filter(Boolean).pop() ?? "";
  return withUtm(`${group}/${plan}`, groupSlug ? `${groupSlug}-${plan}` : plan);
}

/** A store group landing URL (catalog page) tagged for attribution. */
export function storeGroupUrl(group: keyof typeof storeGroups): string {
  return withUtm(storeGroups[group], group);
}
