import { Gauge, RefreshCw, ShieldCheck, Wand2 } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Wand2,
    title: "One-click install",
    description: "Softaculous installs WordPress in seconds — no manual database setup.",
  },
  {
    icon: Gauge,
    title: "LiteSpeed Cache + AccelerateWP",
    description: "Page-level and object caching tuned specifically for WordPress.",
  },
  {
    icon: ShieldCheck,
    title: "Hardened by default",
    description: "Imunify360 malware scanning and CloudLinux isolation on every account.",
  },
  {
    icon: RefreshCw,
    title: "Daily backups",
    description: "Automatic backups before every update — restore in a couple of clicks.",
  },
];

export function WpFeatures() {
  return (
    <Reveal>
      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <Card key={f.title} className="flex flex-col items-center gap-2 text-center">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-purple/10 text-brand-purple">
              <f.icon size={20} aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-text-primary">{f.title}</p>
            <p className="text-xs text-text-muted">{f.description}</p>
          </Card>
        ))}
      </div>
    </Reveal>
  );
}
