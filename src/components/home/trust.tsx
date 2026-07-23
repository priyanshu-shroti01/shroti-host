import { Lock, ReceiptText, RefreshCw, Server } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";

const pillars = [
  {
    icon: Lock,
    title: "Security",
    points: ["Free SSL on every account", "Imunify360 malware scanning", "CloudLinux isolation"],
  },
  {
    icon: Server,
    title: "Infrastructure",
    points: ["Cloudflare network in front of every site", "LiteSpeed web server", "NVMe SSD storage"],
  },
  {
    icon: RefreshCw,
    title: "Reliability",
    points: ["Daily automatic backups", "Isolated resource allocation", "Free migration, zero data loss"],
  },
  {
    icon: ReceiptText,
    title: "Transparency",
    points: ["Renewal pricing shown upfront", "No hidden setup fees", "Real people for support"],
  },
];

const stack = ["Cloudflare", "LiteSpeed", "CloudLinux", "Imunify360", "Let's Encrypt"];

export function Trust() {
  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Why you can trust ShrotiHost
        </h2>
        <p className="mt-4 text-text-secondary">
          Serving customers since 2023, with real substance instead of inflated numbers.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((pillar, i) => (
          <Reveal key={pillar.title} delay={i * 0.06}>
            <SpotlightCard className="h-full">
              <div className="p-6">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-purple/10 text-brand-purple">
                  <pillar.icon size={20} aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-text-primary">{pillar.title}</h3>
                <ul className="mt-3 space-y-1.5">
                  {pillar.points.map((point) => (
                    <li key={point} className="text-xs text-text-secondary">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-dashed border-border-strong p-5">
          <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
            Verified in our stack
          </span>
          {stack.map((name) => (
            <span
              key={name}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-text-secondary"
            >
              {name}
            </span>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
