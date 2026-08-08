export type PromoIcon = "graduation-cap" | "tag" | "percent" | "clock";

export type PromoBannerConfig = {
  /** Unique campaign key — also drives the sessionStorage dismiss key, so a
   *  new campaign (new id) naturally re-shows the bar to users who dismissed
   *  a previous one. */
  id: string;
  /** Kill switch — set false to hide without deleting the config. */
  active: boolean;
  /** "promo" = coupon/urgency styling (gradient background, code pill,
   *  optional countdown). "info" = the original plain single-link styling. */
  kind: "promo" | "info";
  message: string;
  /** Short label like "XX% OFF". Not a real number until business supplies one. */
  discountLabel?: string;
  code?: string;
  href: string;
  /** ISO timestamp of the offer's real end date. Left unset until one exists —
   *  an absent value simply hides the countdown rather than faking a deadline. */
  expiresAt?: string;
  icon?: PromoIcon;
};

/**
 * PLACEHOLDER CAMPAIGN — discountLabel, code, and the promo code baked into
 * href all need real business sign-off before this ships to production.
 */
export const homepagePromo: PromoBannerConfig = {
  id: "launch-promo-2026",
  active: true,
  kind: "promo",
  message: "Limited-time launch offer on your first term.",
  discountLabel: "XX% OFF", // TODO(business): real discount percentage
  code: "PLACEHOLDER10", // TODO(business): real coupon code
  href: "https://portal.shrotihost.in/cart.php?promocode=PLACEHOLDER10", // TODO(business): confirm once code is real
  icon: "tag",
};
