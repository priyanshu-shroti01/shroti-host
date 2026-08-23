import {
  ArrowRightLeft,
  Bug,
  Cloud,
  Code2,
  Database,
  Gauge,
  Globe,
  HardDrive,
  Layers,
  LifeBuoy,
  Lock,
  Mail,
  Shield,
  SquareTerminal,
  Wrench,
  Zap,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section";

/** Every item here ships on every hosting plan — the full baseline, nothing tier-gated. */
const included = [
  { icon: HardDrive, label: "NVMe SSD Storage" },
  { icon: Gauge, label: "Unmetered Bandwidth" },
  { icon: Lock, label: "Free SSL Certificates" },
  { icon: Cloud, label: "Daily JetBackup Backups" },
  { icon: Wrench, label: "cPanel + Softaculous" },
  { icon: Globe, label: "Managed WordPress" },
  { icon: Zap, label: "LiteSpeed + LSCache" },
  { icon: Layers, label: "CloudLinux Isolation" },
  { icon: Shield, label: "Imunify360 + DDoS Shield" },
  { icon: Bug, label: "Malware Scanner" },
  { icon: Code2, label: "Node.js, Python & Ruby" },
  { icon: SquareTerminal, label: "Terminal (Jailed SSH)" },
  { icon: Mail, label: "Email on Your Domain" },
  { icon: Database, label: "Unlimited MySQL Databases" },
  { icon: ArrowRightLeft, label: "Free Website Migration" },
  { icon: LifeBuoy, label: "Priority support (WhatsApp + tickets)" },
];

export function EverythingIncluded() {
  return (
    <Reveal>
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>All plans</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Every plan gets all of this.
        </h2>
        <p className="mt-4 text-text-secondary">
          The baseline, not the upsell — nothing here is gated behind a higher tier.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {included.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
          >
            <item.icon size={18} className="shrink-0 text-brand-purple" aria-hidden="true" />
            <span className="text-sm font-medium text-text-secondary">{item.label}</span>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
