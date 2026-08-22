import { Globe2, Shield, Zap, Layers, HardDrive, CheckCircle2, Cloud } from "lucide-react";

/**
 * The trust strip's "show, don't list" upgrade (cinematic-product-design:
 * a connected request pipeline instead of a marquee of stack names). Each
 * node is a real stage a visitor's request passes through on our stack, in
 * actual order — the visual *is* the architecture, not decoration.
 *
 * Motion: one CSS keyframe animation sweeps a brand-gradient highlight along
 * the connector line (GPU-only: background-position). Under
 * prefers-reduced-motion the sweep stops and the pipeline reads as a static
 * diagram — a real, non-degraded fallback.
 */
const STAGES = [
  { icon: Globe2, label: "Visitor", sub: "request" },
  { icon: Cloud, label: "Cloudflare", sub: "CDN edge" },
  { icon: Shield, label: "Imunify360", sub: "WAF filter" },
  { icon: Zap, label: "LiteSpeed", sub: "web server" },
  { icon: Layers, label: "CloudLinux", sub: "isolation" },
  { icon: HardDrive, label: "NVMe SSD", sub: "storage" },
  { icon: CheckCircle2, label: "Your site", sub: "live" },
] as const;

export function InfraPipeline() {
  return (
    <div className="mt-6 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div
        role="img"
        aria-label="Request path: visitor to Cloudflare CDN, Imunify360 firewall, LiteSpeed web server, CloudLinux isolation, NVMe SSD storage, then your live site"
        className="mx-auto flex w-max min-w-full max-w-5xl items-center justify-center py-2"
      >
        {STAGES.map((stage, i) => (
          <div key={stage.label} className="flex items-center">
            {i > 0 && (
              <div
                aria-hidden="true"
                className="pipeline-flow h-px w-7 shrink-0 sm:w-12"
                style={{ animationDelay: `${i * 0.35}s` }}
              />
            )}
            <div className="flex shrink-0 flex-col items-center gap-1.5 px-2 text-center sm:px-3">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                  i === STAGES.length - 1
                    ? "border-success/40 bg-success/10 text-success"
                    : "border-border-strong bg-card text-brand-purple"
                }`}
              >
                <stage.icon size={15} aria-hidden="true" />
              </span>
              <span className="text-xs font-semibold leading-none text-text-secondary">{stage.label}</span>
              <span className="text-xs leading-none text-text-muted">{stage.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
