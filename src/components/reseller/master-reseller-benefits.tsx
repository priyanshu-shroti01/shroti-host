import { Network, Palette, Receipt, Server } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const benefits = [
  { icon: Network, label: "Create Sub-Resellers", description: "Hand out WHM reseller accounts of your own — build a network." },
  { icon: Server, label: "Full WHM Access", description: "Manage every cPanel and reseller account you create." },
  { icon: Palette, label: "White-Label Branding", description: "Your brand, top to bottom — including for your sub-resellers." },
  { icon: Receipt, label: "Free WHMCS Billing", description: "Automate signups, invoices, and renewals across every account." },
];

export function MasterResellerBenefits() {
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
