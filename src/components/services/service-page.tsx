import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/section";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ProcessPipeline } from "@/components/services/process-pipeline";
import { EnquiryForm } from "@/components/services/enquiry-form";
import type { Service } from "@/lib/services";

const WHATSAPP = "https://wa.me/919582129099";

/** Full BUILD service page — hero, delivery pipeline, offerings, synergy, FAQs, enquiry. */
export function ServicePage({ service }: { service: Service }) {
  const wa = `${WHATSAPP}?text=${encodeURIComponent(`Hi! I'd like to talk about ${service.name.toLowerCase()}.`)}`;

  return (
    <>
      <Section backdrop={<HeroAtmosphere />} className="pt-10 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>{service.eyebrow}</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            {service.headline[0]}{" "}
            <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
              {service.headline[1]}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-text-secondary">{service.subhead}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="#enquire" size="lg">
              {service.ctaLabel}
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
            <Button href={wa} variant="secondary" size="lg">
              <MessageCircle size={18} aria-hidden="true" />
              Talk it through first
            </Button>
          </div>
          <p className="mt-8 inline-flex items-center gap-2 text-sm text-text-secondary">
            <ShieldCheck size={15} className="text-brand-purple" aria-hidden="true" />
            Built by the team behind this website and the ShrotiHost platform.
          </p>
        </div>
      </Section>

      <Section className="bg-surface/30">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            How a project{" "}
            <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
              actually moves
            </span>
          </h2>
          <p className="mt-4 text-text-secondary">{service.processIntro}</p>
        </div>
        <Reveal className="mt-14">
          <ProcessPipeline
            stages={service.process.map((stage) => ({
              title: stage.title,
              description: stage.description,
              // Rendered here, server-side: elements serialize across the
              // client boundary; component functions don't.
              icon: <stage.icon size={18} aria-hidden="true" />,
            }))}
          />
        </Reveal>
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            What we{" "}
            <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">build</span>
          </h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {service.offerings.map((offering, i) => (
            <Reveal key={offering.title} delay={i * 0.05} className="h-full">
              <SpotlightCard className="h-full">
                <div className="p-6">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 text-brand-purple">
                    <offering.icon size={20} aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-text-primary">{offering.title}</h3>
                  <p className="mt-2 text-sm text-text-secondary">{offering.description}</p>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-surface/30">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Why build it{" "}
            <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
              where it&apos;s hosted
            </span>
          </h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 lg:grid-cols-3">
          {service.synergy.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.07} className="h-full">
              <div className="h-full rounded-2xl border border-border bg-card p-6">
                <h3 className="text-base font-semibold text-text-primary">{item.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-text-secondary">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Honest{" "}
            <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">answers</span>
          </h2>
          <div className="mt-10 space-y-3">
            {service.faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-border bg-card px-5 py-4 open:border-brand-purple/40"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-text-primary marker:content-none [&::-webkit-details-marker]:hidden">
                  {faq.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      <Section id="enquire" className="bg-surface/30">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[2fr_3fr] lg:items-start">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              {service.ctaLabel}
              <span className="text-brand-purple">.</span>
            </h2>
            <p className="mt-4 text-text-secondary">
              Describe the project in a few honest sentences. We reply within one business day with
              questions, a direction, and a concrete quote — never an automated sequence.
            </p>
            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-wide text-text-muted">Related</p>
              <ul className="mt-3 space-y-2">
                {service.related.map((r) => (
                  <li key={r.href}>
                    <Button href={r.href} variant="ghost" size="md" className="px-0">
                      {r.label}
                      <ArrowRight size={14} aria-hidden="true" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <EnquiryForm
            service={service.slug}
            defaultProjectType={
              service.slug === "app-development"
                ? "Mobile App"
                : service.slug === "ecommerce-development"
                  ? "E-commerce"
                  : service.slug === "saas-development"
                    ? "SaaS"
                    : service.slug === "custom-software"
                      ? "Custom Software"
                      : "Website"
            }
          />
        </div>
      </Section>
    </>
  );
}
