import { CheckCircle2, Rocket, TrendingUp, Building2, Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";

const benefits = [
  "Introductory discounts for new founders",
  "Priority onboarding & migration assistance",
  "Easy upgrade path as traffic grows",
  "Documentation built for developers",
];

const roadmap = [
  { icon: Rocket, label: "Launch", active: true },
  { icon: TrendingUp, label: "Grow", active: true },
  { icon: Building2, label: "Scale", active: true },
  { icon: Sparkle, label: "Enterprise", active: false },
];

export function StartupProgram() {
  return (
    <Reveal>
      <div className="grid gap-10 rounded-3xl border border-border bg-surface p-10 lg:grid-cols-2 lg:items-center lg:p-14">
        <div className="order-2 lg:order-1">
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
            Your growth roadmap
          </p>
          <div className="mt-6 flex items-center">
            {roadmap.map((step, i) => (
              <div key={step.label} className="flex flex-1 items-center last:flex-initial">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                      step.active
                        ? "border-brand-blue bg-brand-blue/10 text-brand-blue"
                        : "border-dashed border-border-strong text-text-muted"
                    }`}
                  >
                    <step.icon size={20} aria-hidden="true" />
                  </div>
                  <span className="text-xs font-medium text-text-secondary">{step.label}</span>
                  {!step.active && <Badge tone="neutral">Future</Badge>}
                </div>
                {i < roadmap.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 ${step.active ? "bg-brand-blue/40" : "bg-border"}`}
                  />
                )}
              </div>
            ))}
          </div>

          <ul className="mt-10 space-y-3">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-sm text-text-primary">
                <CheckCircle2 size={18} className="shrink-0 text-brand-blue" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="order-1 lg:order-2">
          <Eyebrow>Startup Program</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Launch your MVP without infrastructure headaches.
          </h2>
          <p className="mt-4 text-text-secondary">
            Reliable infrastructure. Transparent pricing. Room to grow — without migrating
            servers.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/startup" size="lg">
              Explore Startup Program
            </Button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
