import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
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
          <h1 className="mt-4 text-4xl font-extrabold leading-none tracking-tighter text-text-primary sm:text-5xl lg:text-6xl">
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
            How a project actually moves
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
            What we build
          </h2>
        </div>
        <Reveal className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {service.offerings.map((offering) => (
              <SpotlightCard key={offering.title} className="h-full">
                <div className="p-6">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 text-brand-purple">
                    <offering.icon size={20} aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-text-primary">{offering.title}</h3>
                  <p className="mt-2 text-sm text-text-secondary">{offering.description}</p>
                </div>
              </SpotlightCard>
          ))}
        </Reveal>
      </Section>

      <Section className="bg-surface/30">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Why build it where it&apos;s hosted
          </h2>
        </div>
        <Reveal className="mx-auto mt-12 grid max-w-5xl gap-5 lg:grid-cols-3">
          {service.synergy.map((item) => (
              <div key={item.title} className="h-full rounded-2xl border border-border bg-card p-6">
                <h3 className="text-base font-semibold text-text-primary">{item.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-text-secondary">{item.description}</p>
              </div>
          ))}
        </Reveal>
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Honest answers
          </h2>
          <div className="mt-10">
            <Accordion items={service.faqs} />
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
