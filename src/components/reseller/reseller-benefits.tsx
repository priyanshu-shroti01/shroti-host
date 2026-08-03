import { Palette, Receipt, Server, Shield } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const benefits = [
  { icon: Server, label: "Full WHM Access", description: "Create, manage, and suspend cPanel accounts from your own WHM." },
  { icon: Palette, label: "White-Label Branding", description: "Your customers see your brand — ShrotiHost stays behind the scenes." },
  { icon: Receipt, label: "Free WHMCS Billing", description: "Automate signups, invoices, and renewals from day one." },
  { icon: Shield, label: "DDoS & Imunify360", description: "The same enterprise-grade protection on every account you host." },
];

export function ResellerBenefits() {
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
