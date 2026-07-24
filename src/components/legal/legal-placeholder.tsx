import { AlertTriangle, LifeBuoy } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

export function LegalPlaceholder({
  title,
  sections,
}: {
  title: string;
  sections: string[];
}) {
  return (
    <Reveal className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">{title}</h1>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/5 p-5">
        <AlertTriangle size={20} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-text-primary">
            Placeholder — not legal advice, not yet in effect
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            This page is a structural outline only. The actual {title.toLowerCase()}{" "}
            needs to be written or reviewed by a qualified professional before it&apos;s
            published as binding. Nothing below should be treated as ShrotiHost&apos;s real
            policy yet.
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-6">
        {sections.map((s, i) => (
          <div key={s} className="border-b border-border pb-6 last:border-0">
            <p className="text-xs font-mono text-text-muted">{String(i + 1).padStart(2, "0")}</p>
            <h2 className="mt-1 text-lg font-semibold text-text-primary">{s}</h2>
            <p className="mt-2 text-sm text-text-muted">Content pending.</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center gap-3 rounded-2xl border border-border-strong bg-card p-5">
        <LifeBuoy size={18} className="shrink-0 text-brand-purple" aria-hidden="true" />
        <div className="flex-1">
          <p className="text-sm text-text-secondary">Questions in the meantime? Reach the real team.</p>
        </div>
        <Button href="https://portal.shrotihost.in/submitticket.php" size="md">
          Contact us
        </Button>
      </div>
    </Reveal>
  );
}
