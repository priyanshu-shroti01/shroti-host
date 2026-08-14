import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModulePage } from "@/components/modules/module-page";
import { getModule } from "@/lib/modules";

export const metadata: Metadata = {
  title: "WHMCS Gateway Fees & Allocator Module",
  description: "Recover payment gateway costs and control which payment methods appear at checkout — per country, currency, client, and order. For WHMCS.",
  alternates: { canonical: "/whmcs-gateway-fees-allocator" },
};

export default function Page() {
  const mod = getModule("gateway-fees-allocator");
  if (!mod) notFound();
  return <ModulePage module={mod} />;
}
