"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Code2, Server, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The brand-architecture statement: one partner carries a project across
 * three stages. The connector dot travels HOST → BUILD → SCALE so the
 * visitor understands these are one continuous journey, not three separate
 * departments — that is the animation's entire job. Reduced motion: the
 * connector renders as a filled line, journey implied by order.
 */
const PILLARS = [
  {
    key: "HOST",
    icon: Server,
    promise: "Your address and your ground.",
    body: "Domains, LiteSpeed hosting, and the infrastructure your project stands on — live in minutes.",
    links: [
      { label: "Hosting", href: "/hosting" },
      { label: "Domains", href: "/domains" },
      { label: "VPS (coming soon)", href: "/vps" },
    ],
    cta: { label: "Explore hosting", href: "/hosting" },
  },
  {
    key: "BUILD",
    icon: Code2,
    promise: "The thing itself, built for you.",
    body: "Websites, web apps, stores, mobile apps, and SaaS — designed and engineered by the team that runs the platform.",
    links: [
      { label: "Websites", href: "/web-development" },
      { label: "Mobile Apps", href: "/app-development" },
      { label: "E-commerce", href: "/ecommerce-development" },
      { label: "SaaS", href: "/saas-development" },
    ],
    cta: { label: "Start a project", href: "/web-development" },
  },
  {
    key: "SCALE",
    icon: TrendingUp,
    promise: "Growth without re-platforming.",
    body: "Deployment, optimization, maintenance, and the move to bigger infrastructure — with the same team, not a new vendor.",
    links: [
      { label: "Custom Software", href: "/custom-software" },
      { label: "VPS Roadmap", href: "/vps" },
      { label: "Free Migration", href: "/contact" },
    ],
    cta: { label: "Plan the next step", href: "/custom-software" },
  },
];

export function HostBuildScale() {
  const reducedMotion = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(trackRef, { once: false, margin: "-100px" });

  return (
    <div>
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          One partner, from first domain{" "}
          <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
            to production
          </span>
        </h2>
        <p className="mt-4 text-text-secondary">
          Buy a domain today, launch a site tomorrow, hire us to build the product, and scale it on
          the same infrastructure — without ever switching vendors.
        </p>
      </Reveal>

      {/* Journey connector — decorative; the pillar order carries the meaning. */}
      <div ref={trackRef} aria-hidden="true" className="relative mx-auto mt-14 hidden h-0.5 max-w-4xl bg-border lg:block">
        {reducedMotion ? (
          <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/60 to-brand-blue/60" />
        ) : (
          <motion.div
            className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-brand-purple shadow-[0_0_12px_var(--color-brand-purple)]"
            animate={inView ? { left: ["0%", "100%"] } : {}}
            transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.8 }}
          />
        )}
      </div>

      <div className="mx-auto mt-6 grid max-w-6xl gap-6 lg:mt-8 lg:grid-cols-3">
        {PILLARS.map((pillar, i) => (
          <Reveal key={pillar.key} delay={i * 0.08} className="h-full">
            <SpotlightCard className="h-full">
              <div className="flex h-full flex-col p-7">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold tracking-tight text-text-primary">
                    {pillar.key}
                  </span>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 text-brand-purple">
                    <pillar.icon size={20} aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold text-text-primary">{pillar.promise}</p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{pillar.body}</p>
                <ul className="mt-5 space-y-1.5">
                  {pillar.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-brand-purple"
                      >
                        <span
                          aria-hidden="true"
                          className="h-1 w-1 rounded-full bg-border-strong transition-colors group-hover:bg-brand-purple"
                        />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <Link
                    href={pillar.cta.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-purple hover:underline"
                  >
                    {pillar.cta.label}
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
