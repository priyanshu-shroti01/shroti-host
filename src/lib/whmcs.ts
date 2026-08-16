/**
 * WHMCS (portal.shrotihost.in) storefront URLs.
 *
 * Plain module on purpose — it is imported by server components (pages) AND
 * client components. Never move these into a "use client" file: non-component
 * exports from client modules arrive on the server as client-reference stubs,
 * and every prop built from them silently becomes undefined.
 */
export const WHMCS_PORTAL = "https://portal.shrotihost.in";
export const WHMCS_STORE = `${WHMCS_PORTAL}/index.php/store`;

/**
 * Store groups as they exist in WHMCS. Each hosting line deep-links to its own
 * group so the shopper lands on the catalog they were just reading, not the
 * generic cart.
 */
export const storeGroups = {
  shared: `${WHMCS_STORE}/shared-hosting`,
  wordpress: `${WHMCS_STORE}/wordpress-hosting`,
  unlimited: `${WHMCS_STORE}/unlimited-hosting`,
  reseller: `${WHMCS_STORE}/reseller-hosting`,
  masterReseller: `${WHMCS_STORE}/master-reseller`,
  // No dedicated group in WHMCS yet — closest catalog is master reseller.
  alphaReseller: `${WHMCS_STORE}/master-reseller`,
} as const;
