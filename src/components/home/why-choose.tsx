import { Code2, Gauge, HeartHandshake, ReceiptText, TrendingUp, Truck } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";

const chapters = [
  {
    step: "01",
    title: "Build",
    headline: "Start with tools developers actually want.",
    description:
      "Node.js, Python, and PHP runtimes, Git deployment, and a real terminal — not a locked-down file manager.",
    points: [
      { icon: Code2, label: "Developer friendly" },
      { icon: ReceiptText, label: "Transparent pricing" },
    ],
  },
  {
    step: "02",
    title: "Deploy",
    headline: "Go live on infrastructure built for speed.",
    description:
      "LiteSpeed servers and CloudLinux isolation keep your site fast — and if you're coming from another host, we migrate it for free.",
    points: [
      { icon: Gauge, label: "Built for performance" },
      { icon: Truck, label: "Free migration, always" },
    ],
  },
  {
    step: "03",
    title: "Scale",
    headline: "Grow without ever migrating servers.",
    description:
      "Move from Launch to Grow to Scale — and eventually VPS or Cloud — without touching a single file. Support from people who understand hosting.",
    points: [
      { icon: TrendingUp, label: "Room to grow" },
      { icon: HeartHandshake, label: "Real human support" },
    ],
  },
];

export function WhyChoose() {
  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Build. Deploy. Scale.
          <span className="block text-brand-purple">Everything you need. One platform.</span>
        </h2>
        <p className="mt-4 text-text-secondary">
          We compete on experience, performance, and trust — not a race to the bottom on price.
        </p>
      </div>

      <div className="mt-16 space-y-16">
        {chapters.map((chapter, i) => (
          <Reveal key={chapter.step}>
            <div
              className={`grid items-center gap-10 lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div>
                <span className="font-mono text-sm font-semibold text-brand-purple">
                  {chapter.step}
                </span>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                  {chapter.title}
                </h3>
                <p className="mt-3 text-lg text-text-primary/90">{chapter.headline}</p>
                <p className="mt-3 max-w-md text-text-secondary">{chapter.description}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {chapter.points.map((point) => (
                    <Badge key={point.label} tone="neutral">
                      <point.icon size={13} aria-hidden="true" />
                      {point.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="relative flex h-56 items-center justify-center rounded-3xl border border-border bg-gradient-to-br from-surface to-card sm:h-64">
                <span className="select-none text-[8rem] font-bold leading-none text-border sm:text-[10rem]">
                  {chapter.step}
                </span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl border border-border-strong bg-card text-brand-purple shadow-xl">
                    {chapter.title === "Build" && <Code2 size={32} aria-hidden="true" />}
                    {chapter.title === "Deploy" && <Gauge size={32} aria-hidden="true" />}
                    {chapter.title === "Scale" && <TrendingUp size={32} aria-hidden="true" />}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
