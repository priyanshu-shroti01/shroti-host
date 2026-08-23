export type PromoIcon = "graduation-cap" | "tag" | "percent" | "clock";

export type PromoBannerConfig = {
  /** Unique campaign key — also drives the storage dismiss keys, so a
   *  new campaign (new id) naturally re-shows the bar and welcome dialog to
   *  users who dismissed a previous one. */
  id: string;
  /** Kill switch — set false to hide without deleting the config. */
  active: boolean;
  /** "promo" = coupon/urgency styling (gradient background, code pill,
   *  optional countdown). "info" = the original plain single-link styling. */
  kind: "promo" | "info";
  message: string;
  /** Optional shorter sentence for narrow screens (< sm); falls back to `message`. */
  shortMessage?: string;
  /** Short label like "XX% OFF". Not a real number until business supplies one. */
  discountLabel?: string;
  code?: string;
  href: string;
  /** ISO timestamp of the offer's real end date. Left unset until one exists —
   *  an absent value simply hides the countdown rather than faking a deadline. */
  expiresAt?: string;
  icon?: PromoIcon;
};

export const homepagePromo: PromoBannerConfig = {
  id: "shrotihost-40-2026",
  active: true,
  kind: "promo",
  // The bar renders the code pill next to this message — the sentence names
  // the code too so the offer reads complete when copied or read aloud.
  message: "40% off the listed price on your first month with code SHROTIHOST — new customers only.",
  shortMessage: "40% off your first month — new customers only.",
  discountLabel: "40% OFF",
  code: "SHROTIHOST",
  href: "https://portal.shrotihost.in/cart.php?promocode=SHROTIHOST",
  icon: "tag",
  // OWNER TODO: set `expiresAt` (ISO timestamp) to the real end date of this
  // offer, or flip `active` to false. Left unset on purpose — an invented
  // deadline is a fake countdown, and an open-ended "first month" discount
  // stacked on the permanent strike-through price reads as two overlapping
  // discounts with no end.
};
