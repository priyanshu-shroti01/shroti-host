/**
 * Shared motion system — keeps durations, easing, and stagger consistent
 * across the site instead of ad-hoc values per component.
 */

export const duration = {
  hover: 0.18,
  click: 0.1,
  card: 0.25,
  section: 0.5,
} as const;

export const easing = {
  outCubic: [0.33, 1, 0.68, 1] as const,
  inOutQuart: [0.76, 0, 0.24, 1] as const,
  spring: { type: "spring" as const, stiffness: 260, damping: 24 },
};

export const stagger = {
  cards: 0.08,
};

/** Standard scroll-reveal: fade + move up. Never bounce or overshoot. */
export const revealVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.section, ease: easing.outCubic },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger.cards },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.card, ease: easing.outCubic },
  },
};
