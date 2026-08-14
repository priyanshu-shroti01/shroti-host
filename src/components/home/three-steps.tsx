import { CreditCard, Rocket, Search } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const steps = [
  {
    icon: Search,
    number: "1",
    title: "Choose a plan",
    description: "Compare Bronze, Gold, Platinum, and Diamond — transparent pricing, no hidden fees.",
  },
  {
    icon: CreditCard,
    number: "2",
    title: "Complete payment",
    description: "Secure checkout. Your account activates as soon as payment clears.",
  },
  {
    icon: Rocket,
    number: "3",
    title: "Launch your site",
    description: "Log in to cPanel, install WordPress in one click, and you're live.",
  },
];

export function ThreeSteps() {
  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Get online in <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">3 simple steps</span>
        </h2>
        <p className="mt-4 text-text-secondary">No technical knowledge needed.</p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.1}>
            <div className="relative rounded-2xl border border-border bg-card p-6 text-center">
              <span className="absolute right-5 top-4 font-mono text-3xl font-semibold text-border-strong">
                {step.number}
              </span>
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-purple/10 text-brand-purple">
                <step.icon size={22} aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-text-primary">{step.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{step.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
