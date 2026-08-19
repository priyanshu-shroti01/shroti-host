import { StatPill } from "@/components/ui/stat-pill";
import { InfraPipeline } from "@/components/home/infra-pipeline";
import { Check, Clock3, Sparkles, Star } from "lucide-react";
import { commonFeatures } from "@/lib/plans";

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
      {/* The stack as a connected request path — each node is a real stage a
          visitor's request passes through, in actual order. Replaces the old
          decorative ghost-text marquee (cinematic-product-design: show the
          pipeline, don't list the names). */}
      <InfraPipeline />
    </div>
  );
}
