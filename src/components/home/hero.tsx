"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Magnetic } from "@/components/ui/magnetic";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { useCurrency } from "@/components/currency-provider";
import { plans, commonFeatures } from "@/lib/plans";
import { HeroDeploy } from "./hero-deploy";
import { HeroBackground } from "./hero-background";

const techBadges = ["LiteSpeed", "CloudLinux", "NVMe SSD", "Let's Encrypt", "cPanel", "Imunify360"];

export function Hero() {
  const { currency, convertDisplay } = useCurrency();
  const startingPlan = plans[0];

  return (
    <div className="relative overflow-hidden">
      <HeroBackground />

      <Container className="relative grid gap-6 pb-10 pt-8 sm:gap-10 sm:pb-16 sm:pt-20 lg:grid-cols-11 lg:items-center lg:gap-8 lg:pb-16 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="lg:col-span-5"
        >
          <Badge tone="purple">Backed by Cloudflare + LiteSpeed infrastructure</Badge>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:mt-6 sm:text-5xl lg:text-[3.1rem] lg:leading-[1.05]">
            Launch Your Website
            <span className="block text-brand-purple">in Under 5 Minutes.</span>
          </h1>

          <p className="mt-4 max-w-lg text-base text-text-secondary sm:mt-6 sm:text-lg">
            Hosting, domains, migration, and a developer-ready stack — priced honestly, on a
            global network.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 sm:mt-9">
            <Magnetic>
              <Button href="/hosting" size="lg">
                Launch Your Website
                <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </Magnetic>
            <Button href="#compare" variant="secondary" size="lg">
              Compare Plans
            </Button>
          </div>

          <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-5 sm:mt-9 sm:pt-6">
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
                Starting at
              </dt>
              <dd className="mt-1 text-xl font-semibold text-text-primary">
                <AnimatedCounter
                  key={currency}
                  value={convertDisplay(startingPlan.annualPrice)}
                  prefix={currency === "INR" ? "₹" : currency === "USD" ? "$" : "€"}
                  suffix="/mo"
                />
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wide text-text-muted">Plans</dt>
              <dd className="mt-1 text-xl font-semibold text-text-primary">
                <AnimatedCounter value={plans.length} />
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
                Included
              </dt>
              <dd className="mt-1 text-xl font-semibold text-text-primary">
                <AnimatedCounter value={commonFeatures.length} suffix="+" />
              </dd>
            </div>
          </dl>

          <div className="mt-6 hidden flex-wrap gap-2 sm:flex">
            {techBadges.map((name) => (
              <span
                key={name}
                className="rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-text-muted"
              >
                {name}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="relative mx-auto flex w-full max-w-sm items-center justify-center lg:col-span-6 lg:max-w-none"
        >
          <HeroDeploy />
        </motion.div>
      </Container>
    </div>
  );
}
