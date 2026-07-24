import { Gauge, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section";

const values = [
  { icon: Heart, title: "Customer First", body: "Every decision should improve the customer experience." },
  { icon: ShieldCheck, title: "Transparency", body: "No hidden costs. No misleading marketing." },
  { icon: Gauge, title: "Performance", body: "Fast websites and responsive services." },
  { icon: Sparkles, title: "Accessibility", body: "Approachable for beginners, powerful for professionals." },
];

export function MissionValues() {
  return (
    <div>
      <Reveal className="mx-auto max-w-2xl text-center">
        <Eyebrow>Our mission</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Empower people to launch — without unnecessary complexity.
        </h2>
        <p className="mt-4 text-text-secondary">
          Customers should spend time building their ideas, not struggling with hosting.
        </p>
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((v, i) => (
          <Reveal key={v.title} delay={i * 0.06}>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-purple/10 text-brand-purple">
                <v.icon size={20} aria-hidden="true" />
              </div>
              <p className="text-sm font-semibold text-text-primary">{v.title}</p>
              <p className="text-xs text-text-muted">{v.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
