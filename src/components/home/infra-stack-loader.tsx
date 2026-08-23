"use client";

import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { InfraStack3D } from "./infra-stack-3d";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Chooses the render path for the exploded infrastructure stack
 * (docs/scroll-choreography.md accessibility contract: the fallback is a
 * genuinely different render path, and SSR/first paint always gets it):
 *
 *   WebGL (infra-stack-webgl.tsx)  — desktop viewport + fine pointer + WebGL2 + motion OK
 *   CSS-3D (infra-stack-3d.tsx)    — everything else: SSR/first paint,
 *     reduced motion (statically exploded), no WebGL2, <lg viewports,
 *     a crashed scene, or a lost GL context. Never a blank hole.
 *
 * The three.js chunk only downloads once a client actually qualifies —
 * `ssr: false` lives here because this is a Client Component (same pattern
 * as chatbot-widget-loader.tsx; not allowed in Server Components).
 */
const InfraStackWebGL = dynamic(
  () => import("./infra-stack-webgl").then((m) => m.InfraStackWebGL),
  { ssr: false, loading: () => <InfraStack3D hoverIndex={null} /> },
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

export function InfraStackVisual({ hoverIndex }: { hoverIndex: number | null }) {
  const reducedMotion = usePrefersReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const [eligible, setEligible] = useState(false);
  const [near, setNear] = useState(false);
  // Latches on the first crash / lost context and never clears by design:
  // a GPU that failed once is not retried within the page's lifetime.
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // `pointer: fine` keeps low-power touch tablets at ≥1024px on the CSS
    // path — viewport width alone is a poor proxy for GPU headroom.
    const mql = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const update = () => setEligible(mql.matches && supportsWebGL2());
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  // Don't even fetch the three.js chunk until the section is within one
  // viewport of view — the CSS version holds the fort, so page-load JS cost
  // is zero and the ~260KB gz parse happens on scroll intent instead
  // (Lighthouse-verified: this kept the WebGL upgrade off the TBT budget).
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
    <div ref={hostRef}>
      {webgl ? (
        <SceneErrorBoundary onError={() => setFailed(true)}>
          <InfraStackWebGL hoverIndex={hoverIndex} onContextLost={() => setFailed(true)} />
        </SceneErrorBoundary>
      ) : (
        <InfraStack3D hoverIndex={hoverIndex} />
      )}
    </div>
  );
}
