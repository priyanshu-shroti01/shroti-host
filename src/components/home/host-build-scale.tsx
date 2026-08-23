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
      { label: "VPS (coming soon)", href: "/vps" },
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
    // One reveal for the whole section; the three pillars arrive together.
    <Reveal>
      <div className="max-w-2xl">
        <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          One partner, from first domain to production
        </h2>
        <p className="mt-4 text-text-secondary">
          Buy a domain today, launch a site tomorrow, hire us to build the product, and scale it on
          the same infrastructure — without ever switching vendors.
        </p>
      </div>

      {/* Journey connector — decorative; the pillar order carries the meaning. */}
      <div ref={trackRef} aria-hidden="true" className="relative mx-auto mt-14 hidden h-0.5 max-w-4xl bg-border lg:block">
        {reducedMotion ? (
          <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/60 to-brand-blue/60" />
        ) : (
          /* Transform-only travel: the carrier spans the track minus the dot
             width (right-2.5), so translateX(100%) of its own width lands the
             dot exactly at the track end — never animate `left` in a loop. */
          <motion.div
            className="absolute inset-y-0 left-0 right-2.5"
            animate={inView ? { x: ["0%", "100%"] } : {}}
            transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.8 }}
          >
            <span className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-brand-purple shadow-[var(--glow-dot)]" />
          </motion.div>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-3">
        {PILLARS.map((pillar) => (
          <SpotlightCard key={pillar.key} className="h-full">
              <div className="flex h-full flex-col p-7">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold tracking-tight text-text-primary">
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
                        prefetch={false}
                        className="group inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-brand-purple-text"
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
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-purple-text hover:underline"
                  >
                    {pillar.cta.label}
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </SpotlightCard>
        ))}
      </div>
    </Reveal>
  );
}
