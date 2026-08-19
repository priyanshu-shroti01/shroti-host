"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Client-safe stage shape: the icon arrives as an already-rendered element
 * (React elements serialize across the server→client boundary; component
 * functions do not).
 */
export type PipelineStage = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const STAGE_MS = 1700;

/**
 * The service page's dominant visual: the real path a project takes, as a
 * connected pipeline that advances stage by stage (the hero checklist's
 * pending/active/done pattern, applied to project delivery). This animation
 * exists so the visitor understands a project here moves through defined,
 * inspectable stages — not a black box between "brief" and "invoice".
 * Reduced motion: every stage shown complete, statically — the informative
 * end state, no cycling.
 */
export function ProcessPipeline({ stages }: { stages: PipelineStage[] }) {
  const reducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reducedMotion || !inView) return;
    const t = setInterval(() => {
      setActive((a) => (a + 1) % (stages.length + 2)); // +2 = a "complete" beat before looping
    }, STAGE_MS);
    return () => clearInterval(t);
  }, [reducedMotion, inView, stages.length]);

  const stateOf = (i: number): "done" | "active" | "pending" => {
    if (reducedMotion) return "done";
    if (i < active) return "done";
    if (i === active) return "active";
    return "pending";
  };

  return (
    <ol
      ref={ref}
      className="relative mx-auto grid max-w-md gap-0 sm:max-w-none sm:grid-cols-3 lg:flex lg:items-stretch lg:justify-center"
    >
      {stages.map((stage, i) => {
        const state = stateOf(i);
        return (
          <li key={stage.title} className="relative flex lg:flex-1 lg:basis-0 lg:flex-col lg:items-center">
            {/* Connector to the previous stage */}
            {i > 0 && (
              <span
                aria-hidden="true"
                className="absolute left-[21px] top-0 h-5 w-0.5 -translate-y-full bg-border sm:hidden lg:left-0 lg:top-[21px] lg:block lg:h-0.5 lg:w-1/2 lg:translate-y-0 lg:-translate-x-0"
              >
                <motion.span
                  className="absolute inset-0 origin-top bg-brand-purple/60 lg:origin-left"
                  initial={false}
                  animate={{ scaleY: state !== "pending" ? 1 : 0, scaleX: state !== "pending" ? 1 : 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.35, ease: "easeOut" }}
                />
              </span>
            )}
            <div className="flex items-start gap-4 py-3 lg:flex-col lg:items-center lg:px-3 lg:text-center">
              <motion.span
                initial={false}
                animate={{
                  scale: state === "active" && !reducedMotion ? 1.08 : 1,
                }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`relative z-10 inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                  state === "done"
                    ? "border-success/50 bg-success/10 text-success"
                    : state === "active"
                      ? "border-brand-purple bg-brand-purple/15 text-brand-purple"
                      : "border-border bg-card text-text-muted"
                }`}
              >
                {state === "done" ? <Check size={18} aria-hidden="true" /> : stage.icon}
                {state === "active" && !reducedMotion && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 animate-ping rounded-full border-2 border-brand-purple/40"
                  />
                )}
              </motion.span>
              <div className="min-w-0 pb-4 lg:pb-0">
                <p
                  className={`text-sm font-semibold transition-colors duration-300 ${
                    state === "pending" ? "text-text-muted" : "text-text-primary"
                  }`}
                >
                  {stage.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-text-secondary lg:mx-auto lg:max-w-[170px]">
                  {stage.description}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
