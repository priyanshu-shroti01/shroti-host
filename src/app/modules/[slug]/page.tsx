import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, ExternalLink } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { modules, getModule } from "@/lib/modules";
import { ModulePricingCards } from "@/components/modules/module-pricing";

export function generateStaticParams() {
  return modules.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mod = getModule(slug);
  if (!mod) return {};
  return {
    title: mod.name,
    description: mod.description,
    alternates: { canonical: `/modules/${mod.slug}` },
  };
}

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mod = getModule(slug);
  if (!mod) notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: mod.name,
    description: mod.description,
    brand: { "@type": "Brand", name: "ShrotiHost" },
    ...(mod.pricing
      ? {
          offers: {
            "@type": "Offer",
            price: mod.pricing[0].priceInr,
            priceCurrency: "INR",
            url: mod.purchaseUrl,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <Section className="pt-16 sm:pt-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>WHMCS Module</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            {mod.name}
          </h1>
          <p className="mt-4 text-lg text-text-secondary">{mod.tagline}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {mod.trial && <Badge tone="success">{mod.trial}</Badge>}
            <Badge tone="neutral">{mod.setup}</Badge>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href={mod.purchaseUrl} target="_blank" rel="noopener noreferrer" size="lg">
              Buy Now
              <ExternalLink size={16} aria-hidden="true" />
            </Button>
            <Button href="/modules" variant="secondary" size="lg">
              All Modules
            </Button>
          </div>
        </Reveal>
      </Section>

      <Section className="bg-surface/30">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-text-secondary">{mod.description}</p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {mod.features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.06}>
              <Card className="h-full">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-purple/10 text-brand-purple">
                  <feature.icon size={20} aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-text-primary">{feature.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{feature.description}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
            Who it&apos;s for
          </h2>
        </Reveal>
        <Reveal delay={0.06}>
          <ul className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
            {mod.audience.map((a) => (
              <li key={a} className="flex items-start gap-2 text-sm text-text-secondary">
                <Check size={16} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
                {a}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {mod.pricing && (
        <Section className="bg-surface/30" id="pricing">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Pricing
            </h2>
          </Reveal>
          <div className="mt-10">
            <ModulePricingCards pricing={mod.pricing} purchaseUrl={mod.purchaseUrl} />
          </div>
        </Section>
      )}

      {!mod.pricing && (
        <Section className="bg-surface/30">
          <Reveal className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Pricing
            </h2>
            <p className="mt-4 text-text-secondary">
              {mod.trial} — full pricing is available on the product page.
            </p>
            <Button href={mod.purchaseUrl} target="_blank" rel="noopener noreferrer" size="lg" className="mt-6">
              View Pricing
              <ExternalLink size={16} aria-hidden="true" />
            </Button>
          </Reveal>
        </Section>
      )}
    </>
  );
}
