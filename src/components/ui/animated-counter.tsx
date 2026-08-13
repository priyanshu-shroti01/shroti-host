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

  useEffect(() => {
    if (!inView) return;
    if (reducedMotion) {
      // Spring bypasses the CSS reduced-motion clamp (inline updates) — jump
      // straight to the final value instead of counting up.
      spring.jump(value);
      motionValue.jump(value);
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.round(value).toLocaleString("en-US")}${suffix}`;
      }
      return;
    }
    motionValue.set(value);
  }, [inView, value, motionValue, spring, reducedMotion, prefix, suffix]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.round(latest).toLocaleString("en-US")}${suffix}`;
      }
    });
  }, [spring, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
