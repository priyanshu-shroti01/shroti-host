"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Counts up to `value` once it scrolls into view. The real formatted value
 * is rendered on the server and on first paint (prices must never SSR as
 * "₹0" — crawlers and reduced-motion users read that HTML); the 0 → value
 * count-up only happens client-side inside the inView effect.
 */
export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  className = "",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px" });
  const motionValue = useMotionValue(value);
  const spring = useSpring(motionValue, { duration: 500, bounce: 0 });
  const countedUp = useRef(false);
  // Foreign-currency prices can be fractional ($0.47) — keep the target's
  // precision so we never animate a real price down to "$0".
  const decimals = Number.isInteger(value) ? 0 : 2;
  const fmt = (n: number) =>
    `${prefix}${n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;

  useEffect(() => {
    if (!inView) return;
    if (reducedMotion) {
      // Spring bypasses the CSS reduced-motion clamp (inline updates) — jump
      // straight to the final value instead of counting up.
      spring.jump(value);
      motionValue.jump(value);
      if (ref.current) {
        ref.current.textContent = fmt(value);
      }
      return;
    }
    if (!countedUp.current) {
      // First sight: drop the spring to 0 and let it glide to the real value.
      // The source MotionValue already holds `value`, so drive the spring
      // directly (a source change would schedule the same animation).
      countedUp.current = true;
      spring.jump(0);
      spring.set(value);
      return;
    }
    // Later target changes (currency switch) glide from the current figure.
    motionValue.set(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fmt is derived from value/prefix/suffix
  }, [inView, value, motionValue, spring, reducedMotion, prefix, suffix, decimals]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = fmt(latest);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fmt is derived from prefix/suffix/decimals
  }, [spring, prefix, suffix, decimals]);

  return (
    <span ref={ref} className={className}>
      {fmt(value)}
    </span>
  );
}
