import { Marquee } from "@/components/ui/marquee";
import { StatPill } from "@/components/ui/stat-pill";
import { Check, Clock3, Sparkles, Star } from "lucide-react";
import { commonFeatures } from "@/lib/plans";

const tech = [
  "Cloudflare",
  "LiteSpeed",
  "CloudLinux",
  "cPanel",
  "Node.js",
  "Python",
  "PHP",
  "MariaDB",
  "Imunify360",
  "Let's Encrypt",
  "NVMe SSD",
];

const FEATURED_COMMON_FEATURES = ["Free SSL", "Daily Backups", "Free Migration"];
const featuredFeatures = commonFeatures.filter((f) => FEATURED_COMMON_FEATURES.includes(f));

export function TrustedTech() {
  return (
    <div className="border-y border-border bg-surface/40 py-10">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-2.5 px-6">
        <StatPill icon={Clock3}>Serving customers since 2023</StatPill>
        {featuredFeatures.map((feature) => (
          <StatPill key={feature} icon={Check} iconClassName="text-success">
            {feature}
          </StatPill>
        ))}
        <StatPill icon={Sparkles}>AI-assisted support, 24/7</StatPill>
        <StatPill icon={Star} iconClassName="text-warning" href="https://www.trustpilot.com/review/shrotihost.in">
          Reviewed on Trustpilot
        </StatPill>
      </div>

      <p className="mt-8 text-center text-xs font-medium uppercase tracking-widest text-text-muted">
        Powered by an infrastructure stack you can trust
      </p>
      <div className="mt-6">
        <Marquee durationSeconds={32}>
          {tech.map((name) => (
            <span
              key={name}
              className="shrink-0 text-lg font-semibold tracking-tight text-text-secondary/70 grayscale transition-all hover:text-text-primary hover:grayscale-0 sm:text-xl"
            >
              {name}
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
