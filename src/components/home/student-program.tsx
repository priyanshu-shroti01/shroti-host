import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { BrowserFrame } from "@/components/ui/browser-frame";

const projects = [
  { name: "Portfolio Site", tag: "React" },
  { name: "ML Classifier", tag: "Python" },
  { name: "Campus Events App", tag: "Next.js" },
];

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
        <div className="min-w-0">
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

        <div className="relative min-w-0">
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-brand-purple/20 to-brand-blue/10 blur-2xl" aria-hidden="true" />
          <Badge tone="neutral" className="absolute -top-3 right-4 z-10">
            Illustrative preview
          </Badge>
          <BrowserFrame url="yourname.launch.shrotihost.in">
            <div className="flex items-center justify-between border-b border-border px-6 py-3">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-brand-purple to-brand-blue" />
                <span className="text-sm font-semibold text-text-primary">Priya Sharma</span>
              </div>
              <div className="hidden gap-4 text-xs text-text-muted sm:flex">
                <span>Projects</span>
                <span>About</span>
                <span>Contact</span>
              </div>
            </div>
            <div className="space-y-5 p-6">
              <div>
                <p className="text-lg font-semibold text-text-primary">CS student, building in public.</p>
                <p className="mt-1 text-sm text-text-secondary">Final-year @ NIT Trichy · open to internships</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {projects.map((project) => (
                  <div
                    key={project.name}
                    className="rounded-lg border border-border bg-surface p-3"
                  >
                    <p className="truncate text-xs font-medium text-text-primary">{project.name}</p>
                    <p className="mt-1 text-[10px] text-text-muted">{project.tag}</p>
                  </div>
                ))}
              </div>
            </div>
          </BrowserFrame>
        </div>
      </div>
    </Reveal>
  );
}
