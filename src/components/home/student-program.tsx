import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { BrowserFrame } from "@/components/ui/browser-frame";

const benefits = [
  "Student-only pricing",
  "Free SSL & free migration",
  "Launch subdomain, no domain required",
  "Daily backups & LiteSpeed performance",
];

export function StudentProgram() {
  return (
    <Reveal>
      <div className="grid gap-10 rounded-3xl border border-border bg-surface p-10 lg:grid-cols-2 lg:items-center lg:p-14">
        <div>
          <Eyebrow>Student Program</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Launch your portfolio or project for less.
          </h2>
          <p className="mt-4 text-text-secondary">
            Verified students get discounted, professional hosting — built for learning, not just
            launching.
          </p>

          <ul className="mt-6 space-y-3">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-sm text-text-primary">
                <CheckCircle2 size={18} className="shrink-0 text-brand-purple" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/student" size="lg">
              Explore Student Program
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-brand-purple/20 to-brand-blue/10 blur-2xl" aria-hidden="true" />
          <BrowserFrame url="yourname.launch.shrotihost.in">
            <div className="flex items-center justify-between border-b border-border px-6 py-3">
              <div className="h-2.5 w-16 rounded-full bg-text-primary/70" />
              <div className="flex gap-3">
                <div className="h-2 w-8 rounded-full bg-border" />
                <div className="h-2 w-8 rounded-full bg-border" />
                <div className="h-2 w-8 rounded-full bg-border" />
              </div>
            </div>
            <div className="space-y-4 p-6">
              <div className="h-3 w-2/3 rounded-full bg-gradient-to-r from-brand-purple to-brand-blue" />
              <div className="h-2 w-full rounded-full bg-border" />
              <div className="h-2 w-5/6 rounded-full bg-border" />
              <div className="mt-2 grid grid-cols-3 gap-3">
                <div className="h-16 rounded-lg bg-gradient-to-br from-brand-purple/15 to-transparent" />
                <div className="h-16 rounded-lg bg-gradient-to-br from-brand-blue/15 to-transparent" />
                <div className="h-16 rounded-lg bg-surface" />
              </div>
            </div>
          </BrowserFrame>
        </div>
      </div>
    </Reveal>
  );
}
