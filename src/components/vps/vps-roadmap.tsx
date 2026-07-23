import { Check, Cloud, Server, Share2 } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";

const roadmap = [
  { icon: Check, label: "Shared Hosting", status: "live" as const },
  { icon: Server, label: "VPS Hosting", status: "next" as const },
  { icon: Cloud, label: "Cloud Hosting", status: "future" as const },
  { icon: Share2, label: "Reseller Hosting", status: "future" as const },
];

const styles = {
  live: "border-success bg-success/10 text-success",
  next: "border-brand-purple bg-brand-purple/10 text-brand-purple",
  future: "border-dashed border-border-strong text-text-muted",
};

const lineStyles = {
  live: "bg-success/40",
  next: "bg-border",
  future: "bg-border",
};

export function VpsRoadmap() {
  return (
    <Reveal>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Where VPS fits on the roadmap.
        </h2>
        <p className="mt-4 text-text-secondary">Shared hosting today. VPS is what we&apos;re building next.</p>
      </div>

      <div className="mx-auto mt-12 flex max-w-2xl items-center">
        {roadmap.map((step, i) => (
          <div key={step.label} className="flex flex-1 items-center last:flex-initial">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-full border-2 ${styles[step.status]}`}
              >
                <step.icon size={20} aria-hidden="true" />
              </div>
              <span className="text-center text-xs font-medium text-text-secondary sm:text-sm">{step.label}</span>
              {step.status === "next" && <Badge tone="purple">Building now</Badge>}
              {step.status === "future" && <Badge tone="neutral">Planned</Badge>}
            </div>
            {i < roadmap.length - 1 && <div className={`mx-2 h-0.5 flex-1 ${lineStyles[step.status]}`} />}
          </div>
        ))}
      </div>
    </Reveal>
  );
}
