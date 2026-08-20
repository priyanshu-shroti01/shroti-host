"use client";

import { Component, type ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { InfraStack3D } from "./infra-stack-3d";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Chooses the render path for the exploded infrastructure stack
 * (docs/scroll-choreography.md accessibility contract: the fallback is a
 * genuinely different render path, and SSR/first paint always gets it):
 *
 *   WebGL (infra-stack-webgl.tsx)  — desktop viewport + WebGL2 + motion OK
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
  const [eligible, setEligible] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const update = () => setEligible(mql.matches && supportsWebGL2());
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  if (reducedMotion || failed || !eligible) {
    return <InfraStack3D hoverIndex={hoverIndex} />;
  }
  return (
    <SceneErrorBoundary onError={() => setFailed(true)}>
      <InfraStackWebGL hoverIndex={hoverIndex} onContextLost={() => setFailed(true)} />
    </SceneErrorBoundary>
  );
}
