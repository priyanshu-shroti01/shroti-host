"use client";

import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { DecisionSceneCSS } from "./decision-scene-css";
import { useDecisionCycle, type CycleState, type PhaseName } from "./use-decision-cycle";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Chooses the render path for the hero decision scene, on the same contract as
 * infra-stack-loader.tsx (docs/motion-system.md's WebGL clause):
 *
 *   WebGL (decision-scene-webgl) — desktop viewport + fine pointer + WebGL2 + motion OK
 *   CSS-3D (decision-scene-css)  — everything else: SSR/first paint, reduced
 *     motion (parked on the resolved decision), no WebGL2, small viewports, a
 *     crashed scene, or a lost GL context. Never a blank hole.
 *
 * Both paths read one clock (useDecisionCycle) and one coordinate set
 * (constants.ts), so whichever one a visitor gets, they are told the same story
 * at the same moment — and the DOM legend beside the scene stays in step too.
 */
const DecisionSceneWebGL = dynamic(
  () => import("./decision-scene-webgl").then((m) => m.DecisionSceneWebGL),
  { ssr: false },
);

class SceneErrorBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    // Parent swaps to the CSS path via onError; render nothing meanwhile.
    return this.state.failed ? null : this.props.children;
  }
}

function supportsWebGL2(): boolean {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

export function DecisionScene({
  onPhaseChange,
}: {
  onPhaseChange?: (phase: PhaseName, outcome: { winningRule: number; excludedItem: number }) => void;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const [eligible, setEligible] = useState(false);
  const [near, setNear] = useState(false);
  // Latches on the first crash / lost context and never clears by design:
  // a GPU that failed once is not retried within the page's lifetime.
  const [failed, setFailed] = useState(false);

  const { stateRef, phase, cycle, winningRule, excludedItem } = useDecisionCycle();

  useEffect(() => {
    onPhaseChange?.(phase, { winningRule, excludedItem });
  }, [phase, winningRule, excludedItem, onPhaseChange]);

  useEffect(() => {
    // `pointer: fine` keeps low-power touch tablets at >=1024px on the CSS
    // path — viewport width alone is a poor proxy for GPU headroom.
    const mql = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const update = () => setEligible(mql.matches && supportsWebGL2());
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  // Don't fetch the three.js chunk until the hero is within a viewport of view.
  // The CSS scene holds the fort, so page-load JS cost stays at zero and the
  // ~260KB gz parse happens on intent instead of on arrival.
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const webgl = eligible && near && !reducedMotion && !failed;

  return (
    <div ref={hostRef} className="absolute inset-0">
      {webgl ? (
        <SceneErrorBoundary onError={() => setFailed(true)}>
          <DecisionSceneWebGL
            onContextLost={() => setFailed(true)}
            stateRef={stateRef as React.RefObject<CycleState>}
          />
        </SceneErrorBoundary>
      ) : (
        <DecisionSceneCSS phase={phase} cycle={cycle} />
      )}
    </div>
  );
}
