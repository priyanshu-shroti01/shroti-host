import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";

export function MasterResellerHero() {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-glow)" }}
        aria-hidden="true"
      />
      <Reveal className="relative mx-auto max-w-2xl text-center">
        <Badge>Master Reseller Hosting</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
          Create resellers of your own.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">
          Everything in Reseller Hosting, plus WHM reseller accounts you can hand out — build a
          hosting business with its own hosting businesses inside it.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button href="#compare" size="lg">
            View plans
            <ArrowRight size={18} aria-hidden="true" />
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
