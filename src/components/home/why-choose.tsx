import { Cpu, Lock, Server, ShieldCheck, Terminal, Truck } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/section";

const features = [
  {
    icon: Cpu,
    title: "Lightning NVMe SSD",
    description: "Pure NVMe storage on every plan — your site loads fast, every time.",
  },
  {
    icon: Server,
    title: "LiteSpeed + cPanel",
    description: "Faster PHP performance than Apache, with the industry-standard control panel.",
  },
  {
    icon: Lock,
    title: "Free SSL Certificate",
    description: "Auto-installed Let's Encrypt SSL on every domain, renewed automatically.",
  },
  {
    icon: ShieldCheck,
    title: "DDoS + Imunify360",
    description: "Multi-layer protection and malware scanning on every single plan.",
  },
  {
    icon: Terminal,
    title: "SSH Terminal Access",
    description: "Full shell access for developers — deploy, debug, and manage files directly.",
  },
  {
    icon: Truck,
    title: "Free Migration",
    description: "We move your site from any host, free, with minimal downtime.",
  },
];

export function WhyChoose() {
  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>Why ShrotiHost</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Enterprise performance, honest pricing.
        </h2>
        <p className="mt-4 text-text-secondary">
          We compete on experience, performance, and trust — not a race to the bottom on price.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <Reveal key={feature.title} delay={i * 0.06}>
            <Card glow className="h-full">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-purple/10 text-brand-purple">
                <feature.icon size={22} aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-text-primary">{feature.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{feature.description}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
