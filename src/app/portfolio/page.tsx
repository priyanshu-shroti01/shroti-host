import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/section";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { portfolioItems } from "@/lib/portfolio";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Portfolio — Products We Build and Run",
  description:
    "Real work only: the ShrotiHost platform itself and the WHMCS products we build, sell, and support. No stock case studies — everything here is live and inspectable.",
  alternates: { canonical: "/portfolio" },
};

export default function Page() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Portfolio", path: "/portfolio" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <Section backdrop={<HeroAtmosphere />} className="pt-10 sm:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Portfolio</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            Built by{" "}
            <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
              ShrotiHost.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-text-secondary">
            Real work only — the platform you&apos;re browsing and the products we build, sell, and
            support in production. Everything here is live and inspectable, not a mockup.
          </p>
        </div>
      </Section>

      <Section className="bg-surface/30">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
          {portfolioItems.map((item, i) => (
            <Reveal key={item.slug} delay={i * 0.07} className="h-full">
              <SpotlightCard className="h-full">
                <div className="flex h-full flex-col p-6">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 text-brand-purple">
                      <item.icon size={20} aria-hidden="true" />
                    </div>
                    <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                      {item.kind}
                    </span>
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-text-primary">{item.name}</h2>
                  <p className="mt-2 text-sm text-text-secondary">{item.summary}</p>
                  <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                    {item.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <span
                          aria-hidden="true"
                          className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-purple"
                        />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-5">
                    <Button href={item.href} variant="ghost" size="md" className="px-0">
                      {item.linkLabel}
                      <ArrowRight size={14} aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Your project could be{" "}
            <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
              next
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary">
            We publish client work here only with permission, and never pad this page with stock
            case studies. If we build something together and you&apos;re proud of it, it can live
            here too.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="/web-development#enquire" size="lg">
              Start a project
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
            <Button href="/custom-software" variant="secondary" size="lg">
              Explore custom software
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
