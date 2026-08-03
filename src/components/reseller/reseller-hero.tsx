import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";

export function ResellerHero() {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-glow)" }}
        aria-hidden="true"
      />
      <Reveal className="relative mx-auto max-w-2xl text-center">
        <Badge>Reseller Hosting</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
          Start your own hosting business.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">
          Full WHM access, white-label branding, and free WHMCS billing software — sell hosting
          under your own name.
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
