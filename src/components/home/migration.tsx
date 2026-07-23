"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Globe, Server, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const flow = [
  { icon: Globe, label: "Current Host" },
  { icon: Zap, label: "Migration" },
  { icon: Server, label: "ShrotiHost" },
  { icon: CheckCircle2, label: "Done" },
];

const steps = [
  { title: "Submit your request", description: "Tell us about your current host and website." },
  { title: "We handle the transfer", description: "Files, databases, and email moved securely." },
  { title: "You verify and launch", description: "Confirm everything works, then go live." },
];

export function Migration() {
  return (
    <Reveal>
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>Free Migration</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Move Your Website Without the Stress
        </h2>
        <p className="mt-4 text-text-secondary">
          Free migration from any host. Minimal downtime.
        </p>
      </div>

      <div className="relative mx-auto mt-14 max-w-3xl">
        <div className="absolute left-0 right-0 top-6 h-0.5 bg-border" aria-hidden="true">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{ transformOrigin: "left" }}
            className="h-full bg-gradient-to-r from-brand-purple to-brand-blue"
          />
        </div>
        <div className="relative grid grid-cols-4 gap-2">
          {flow.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.2 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-brand-purple bg-bg text-brand-purple">
                <item.icon size={20} aria-hidden="true" />
              </div>
              <span className="text-center text-xs font-medium text-text-secondary sm:text-sm">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {steps.map((step, i) => (
          <Card key={step.title} className="text-center">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-brand-purple/10 text-sm font-semibold text-brand-purple">
              {i + 1}
            </div>
            <h3 className="mt-4 text-base font-semibold text-text-primary">{step.title}</h3>
            <p className="mt-2 text-sm text-text-secondary">{step.description}</p>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Button href="/migration" size="lg">
          Request Free Migration
        </Button>
        <Button href="#compare" variant="secondary" size="lg">
          View Hosting Plans
        </Button>
      </div>
    </Reveal>
  );
}
