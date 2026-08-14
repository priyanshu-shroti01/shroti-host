import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModulePage } from "@/components/modules/module-page";
import { getModule } from "@/lib/modules";

export const metadata: Metadata = {
  title: "WHMCS WhatsApp Notification Module",
  description: "Automate WHMCS invoice reminders, payment confirmations, ticket alerts, OTP verification, and bulk WhatsApp campaigns. From ₹349/mo with free trial.",
  alternates: { canonical: "/whmcs-whatsapp-notification-module" },
};

export default function Page() {
  const mod = getModule("whatsapp-notification");
  if (!mod) notFound();
  return <ModulePage module={mod} />;
}
