"use client";

import { useCallback, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section";
import { DecisionScene } from "./scene/decision-scene-loader";
import type { PhaseName } from "./scene/use-decision-cycle";
import { MonthlyPrice } from "./price";
import { DecisionTrace } from "./decision-trace";
import { STORE_URL } from "@/lib/gateway-fees-module";

/** Which legend chip a given phase belongs to. */
const PHASE_STAGE: Record<PhaseName, number> = {
  gather: 0,
  test: 1,
  match: 1,
  allocate: 2,
  settle: 3,
  hold: 3,
};

const STAGES = [
  { label: "Context", hint: "14 signals narrow the field" },
  { label: "Rules", hint: "exactly one can win" },
  { label: "Allocator", hint: "which items form the base" },
  { label: "Charge", hint: "one labelled invoice line" },
];

export function GatewayHero() {
  const [stage, setStage] = useState(0);

  const handlePhase = useCallback((phase: PhaseName) => {
    setStage(PHASE_STAGE[phase]);
  }, []);

  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24">
      {/* Brand atmosphere, kept behind the Container and clipped to the section. */}
      <div className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-glow)]" aria-hidden="true" />

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-8">
          <div>
            <Eyebrow>WHMCS Payment Infrastructure</Eyebrow>

            <h1 className="mt-4 text-4xl font-extrabold leading-none tracking-tighter text-text-primary sm:text-5xl lg:text-6xl">
              Control every{" "}
              <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
                payment path
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-lg text-text-secondary">
              Charge or discount by payment method, and decide which methods a customer is
              offered in the first place — from the WHMCS admin area, without touching a
              checkout template.
            </p>

            <p className="mt-3 max-w-xl text-sm text-text-muted">
              Every invoice runs the same evaluation: fourteen context signals narrow to one
              rule, the allocator decides which line items form the fee base, and the result
              lands as a single labelled line on the invoice.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href={STORE_URL} size="lg" target="_blank" rel="noopener noreferrer">
                Get Gateway Fees &amp; Allocator
                <ArrowRight size={18} aria-hidden="true" />
              </Button>
              <Button href="#demo" variant="secondary" size="lg">
                Watch it decide
              </Button>
            </div>

            <p className="mt-5 text-sm text-text-muted">
              From <MonthlyPrice className="font-semibold text-text-primary" /> · licensed per
              WHMCS installation
            </p>
          </div>

          {/* The scene is decorative by itself; the trace below carries the
              meaning. Phones get no scene at all rather than a 380px void —
              the trace ribbon is the visual there, and it is the same device
              the rest of the page is built on. */}
          <div className="relative hidden sm:block">
            <div className="relative h-[440px] w-full lg:h-[520px]">
              <DecisionScene onPhaseChange={handlePhase} />
            </div>


          </div>
        </div>

        {/* The signature device, spanning the hero rather than tucked beside
            the canvas — it is the page's through-line, and it stays clear of
            the fixed support widget in the bottom-right. */}
        <DecisionTrace stages={STAGES} active={stage} className="mt-10 border-t border-border pt-8 lg:mt-14" />
      </Container>
    </section>
  );
}
