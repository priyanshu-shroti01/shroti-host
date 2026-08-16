"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

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
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 500, bounce: 0 });
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
      {prefix}0{suffix}
    </span>
  );
}
