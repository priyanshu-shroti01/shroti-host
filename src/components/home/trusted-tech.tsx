import { Marquee } from "@/components/ui/marquee";
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

const pillClasses =
  "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-text-secondary";

export function TrustedTech() {
  return (
    <div className="border-y border-border bg-surface/40 py-10">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-2.5 px-6">
        <span className={pillClasses}>
          <Clock3 size={13} className="text-brand-purple" aria-hidden="true" />
          Serving customers since 2023
        </span>
        {featuredFeatures.map((feature) => (
          <span key={feature} className={pillClasses}>
            <Check size={13} className="text-success" aria-hidden="true" />
            {feature}
          </span>
        ))}
        <span className={pillClasses}>
          <Sparkles size={13} className="text-brand-purple" aria-hidden="true" />
          AI-assisted support, 24/7
        </span>
        <a
          href="https://www.trustpilot.com/review/shrotihost.in"
          target="_blank"
          rel="noopener noreferrer"
          className={`${pillClasses} transition-colors hover:border-brand-purple hover:text-brand-purple`}
        >
          <Star size={13} className="text-warning" aria-hidden="true" />
          Reviewed on Trustpilot
        </a>
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
