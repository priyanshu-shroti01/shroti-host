"use client";

import { useEffect, useRef, useState } from "react";
import { CYCLE_SECONDS, PHASES, cycleOutcome } from "./constants";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

export type PhaseName = keyof typeof PHASES;

export type CycleState = { t: number; cycle: number };

const ORDER: PhaseName[] = ["gather", "test", "match", "allocate", "settle", "hold"];

function phaseAt(t: number): PhaseName {
  // Later phases win where ranges overlap (allocate runs alongside match).
  let current: PhaseName = "gather";
  for (const name of ORDER) {
    const [start] = PHASES[name];
    if (t >= start) current = name;
  }
  return current;
}

/**
 * One clock for the whole hero.
 *
 * The canvas, the CSS fallback and the DOM legend all read from this, so they
 * cannot drift apart mid-cycle. `stateRef` advances every frame for the smooth
 * WebGL path; the React state below changes only at phase boundaries, so the
 * DOM re-renders a handful of times per cycle rather than sixty.
 *
 * Reduced motion stops the clock at the resolved state — the decision already
 * made, fully readable. That is a real alternative, not the animation skipped.
 */
export function useDecisionCycle({ paused = false }: { paused?: boolean } = {}) {
  const reducedMotion = usePrefersReducedMotion();
  const stateRef = useRef<CycleState>({ t: 0, cycle: 0 });
  const [tickedPhase, setTickedPhase] = useState<PhaseName>("gather");
  const [tickedCycle, setTickedCycle] = useState(0);

  // Derived, not stored: reduced motion parks the scene at the resolved state
  // without a render pass just to say so.
  const phase: PhaseName = reducedMotion ? "hold" : tickedPhase;
  const cycle = reducedMotion ? 0 : tickedCycle;

  useEffect(() => {
    if (reducedMotion) {
      // Park inside `hold`: one rule has won, one item is excluded, charge lit.
      stateRef.current.t = 0.92;
      stateRef.current.cycle = 0;
      return;
    }
    if (paused) return;

    let raf = 0;
    let last = performance.now();
    let lastPhase: PhaseName | null = null;
    let lastCycle = -1;

    const tick = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;

      const state = stateRef.current;
      state.t += delta / CYCLE_SECONDS;
      while (state.t >= 1) {
        state.t -= 1;
        state.cycle += 1;
      }

      const next = phaseAt(state.t);
      if (next !== lastPhase) {
        lastPhase = next;
        setTickedPhase(next);
      }
      if (state.cycle !== lastCycle) {
        lastCycle = state.cycle;
        setTickedCycle(state.cycle);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, paused]);

  const outcome = cycleOutcome(cycle);

  return { stateRef, phase, cycle, reducedMotion, ...outcome };
}
