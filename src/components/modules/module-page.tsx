import { ArrowRight, Check, Clock3, Sparkles } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/section";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ModulePricingCards } from "@/components/modules/module-pricing";
import type { WhmcsModule } from "@/lib/modules";

const PURCHASE_URL = "https://portal.shrotihost.in/submitticket.php";

/** Full product page for a WHMCS module — hero, feature grid, audience, pricing, CTA. */
export function ModulePage({ module }: { module: WhmcsModule }) {
  return (
    <>
      <Section backdrop={<HeroAtmosphere />} className="pt-10 sm:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>WHMCS Module</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            {module.name.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
              {module.name.split(" ").slice(-1)}
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">{module.tagline}</p>
          <p className="mx-auto mt-3 max-w-xl text-sm text-text-secondary">{module.description}</p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href={PURCHASE_URL} size="lg">
              Get this module
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-text-secondary">
            {module.trial && (
              <span className="inline-flex items-center gap-1.5">
                <Sparkles size={14} className="text-brand-purple" aria-hidden="true" />
                {module.trial}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={14} className="text-brand-purple" aria-hidden="true" />
              {module.setup}
            </span>
          </div>
        </div>
      </Section>

      <Section className="bg-surface/30">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            What it{" "}
            <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">does</span>
          </h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2">
          {module.features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.06} className="h-full">
              <SpotlightCard className="h-full">
                <div className="p-6">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 text-brand-purple">
                    <feature.icon size={20} aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-text-primary">{feature.title}</h3>
                  <p className="mt-2 text-sm text-text-secondary">{feature.description}</p>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {module.pricing && (
        <Section id="pricing">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              Simple{" "}
              <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
                pricing
              </span>
            </h2>
            <p className="mt-4 text-text-secondary">
              Licensed per WHMCS installation · Prices exclude applicable taxes
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-3xl">
            <ModulePricingCards pricing={module.pricing} purchaseUrl={PURCHASE_URL} />
          </div>
        </Section>
      )}

      <Section className="bg-surface/30">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Built{" "}
            <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">for</span>
          </h2>
          <ul className="mt-8 space-y-3">
            {module.audience.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-sm text-text-secondary">
                <Check size={16} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center">
            <Button href={PURCHASE_URL} size="lg">
              Get {module.name}
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
