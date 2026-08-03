import { Lock, Network, Plug, ReceiptText } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Card } from "@/components/ui/card";

const benefits = [
  { icon: Lock, label: "Free WHOIS privacy", description: "Your contact details stay off public records." },
  { icon: Network, label: "Free DNS management", description: "Point your domain anywhere, no extra fee." },
  { icon: Plug, label: "One-click connect", description: "Wire it straight to a ShrotiHost plan." },
  { icon: ReceiptText, label: "Upfront renewal pricing", description: "The renewal price is on the card — no surprise later." },
];

export function DomainBenefits() {
  return (
    <Reveal>
      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((b) => (
          <Card key={b.label} className="flex flex-col items-center gap-2 text-center">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-purple/10 text-brand-purple">
              <b.icon size={20} aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-text-primary">{b.label}</p>
            <p className="text-xs text-text-muted">{b.description}</p>
          </Card>
        ))}
      </div>
    </Reveal>
  );
}
