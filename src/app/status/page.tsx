import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { StatusBoard } from "@/components/status/status-board";

export const metadata: Metadata = {
  title: "Status",
  description: "ShrotiHost service status — API, DNS, email, network, storage, database, and billing.",
  alternates: { canonical: "/status" },
};

export default function StatusPage() {
  return (
    <>
      <Section className="pt-16 sm:pt-24 pb-0">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge tone="neutral">Status</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            All systems, one view.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">
            A preview of what real-time status monitoring will look like when it ships.
          </p>
        </Reveal>
      </Section>

      <Section>
        <StatusBoard />
        <div className="mt-10 flex justify-center">
          <Button href="https://portal.shrotihost.in/submitticket.php" variant="secondary" size="lg">
            Report an issue
          </Button>
        </div>
      </Section>
    </>
  );
}
