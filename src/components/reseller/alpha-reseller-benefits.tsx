import { Layers, Palette, Receipt, Server } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const benefits = [
  { icon: Layers, label: "Three-Level Hierarchy", description: "cPanel, WHM reseller, and Master Reseller accounts — all in one plan." },
  { icon: Server, label: "Maximum Resources", description: "The highest CPU, RAM, and storage caps in the ShrotiHost lineup." },
  { icon: Palette, label: "White-Label Branding", description: "Your brand at every level of the hierarchy." },
  { icon: Receipt, label: "Free WHMCS Billing", description: "Automate billing across your entire network from one dashboard." },
];

export function AlphaResellerBenefits() {
  return (
    <Reveal>
      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((b) => (
          <div key={b.label} className="flex flex-col items-center gap-2 text-center">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-purple/10 text-brand-purple">
              <b.icon size={20} aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-text-primary">{b.label}</p>
            <p className="text-xs text-text-muted">{b.description}</p>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
