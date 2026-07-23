"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCurrency } from "@/components/currency-provider";
import type { ModulePricing } from "@/lib/modules";

export function ModulePricingCards({
  pricing,
  purchaseUrl,
}: {
  pricing: ModulePricing[];
  purchaseUrl: string;
}) {
  const { format } = useCurrency();

  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {pricing.map((tier) => (
        <Card key={tier.label} className={tier.label === "Annual" ? "border-brand-purple ring-1 ring-brand-purple" : ""}>
          <p className="text-sm font-semibold text-text-primary">{tier.label}</p>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-semibold text-text-primary">{format(tier.priceInr)}</span>
            <span className="text-sm text-text-muted">{tier.period}</span>
          </div>
          {tier.note && (
            <p className="mt-2 flex items-start gap-1.5 text-xs text-text-secondary">
              <Check size={14} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
              {tier.note}
            </p>
          )}
          <Button
            href={purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant={tier.label === "Annual" ? "primary" : "secondary"}
            size="lg"
            className="mt-6 w-full"
          >
            Buy Now
          </Button>
        </Card>
      ))}
    </div>
  );
}
