"use client";

import { ArrowRight, Check } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { faq, STORE_URL } from "@/lib/gateway-fees-module";
import { useModulePrice } from "./price";

/**
 * Pricing, FAQ and the purchase CTA.
 *
 * Prices are the WHMCS catalogue's own per-currency figures, so what is shown
 * here is what the cart charges — no marketing-side conversion in between.
 * The CTA points at the Modules store group, which is the URL that actually
 * resolves; the product's direct deep link is broken upstream by an empty slug
 * in WHMCS and is deliberately not linked until that is fixed.
 */

export function FaqAndCta() {
  const { format, tiers } = useModulePrice();

  return (
    <>
      <Section id="pricing" className="scroll-mt-24">
        <div className="max-w-2xl">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Licensed per WHMCS installation
          </h2>
          <p className="mt-4 text-text-secondary">
            Prices exclude applicable taxes, calculated at checkout.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {tiers.map((tier) => {
            const featured = tier.label === "Annual";
            return (
              <div
                key={tier.label}
                className={`rounded-2xl border bg-card p-6 ${
                  featured
                    ? "border-brand-purple shadow-[var(--shadow-popular)]"
                    : "border-border shadow-[var(--shadow-card)]"
                }`}
              >
                <p className="text-sm font-semibold text-text-primary">{tier.label}</p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tabular-nums text-text-primary">
                    {format(tier.amount)}
                  </span>
                  <span className="text-sm text-text-muted">{tier.period}</span>
                </div>
                <Button
                  href={STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant={featured ? "primary" : "secondary"}
                  size="lg"
                  className="mt-6 w-full"
                >
                  Get the module
                </Button>
              </div>
            );
          })}
        </div>
      </Section>

      <Section id="faq" className="scroll-mt-24 bg-surface/30" compact>
        <div className="max-w-2xl">
          <Eyebrow>Questions</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Before you install it
          </h2>
        </div>
        <div className="mt-10 max-w-3xl">
          <Accordion items={faq} />
        </div>
      </Section>

      <Section compact>
        <div className="rounded-3xl bg-[image:var(--gradient-hero-deep)] px-6 py-12 sm:px-12 sm:py-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Stop absorbing gateway costs you never chose
            </h2>
            <p className="mt-4 text-white/85">
              Set the rules once in your WHMCS admin area, and every invoice after that carries the
              right charge, on the right base, with a line item your customer can read.
            </p>
            <ul className="mt-6 space-y-2">
              {[
                "Works with the gateways you already have",
                "One line item per invoice, labelled by you",
                "Every calculation stored and auditable",
              ].map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-white/85">
                  <Check size={16} className="mt-0.5 shrink-0 text-white" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button
                href={STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="inverse"
                size="lg"
              >
                Get Gateway Fees &amp; Allocator
                <ArrowRight size={18} aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
