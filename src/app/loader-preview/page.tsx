import type { Metadata } from "next";
import { LogoLoader, type LoaderVariant } from "@/components/ui/logo-loader";
import { Section, Eyebrow } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Loader preview",
  robots: { index: false, follow: false },
};

const VARIANTS: { id: LoaderVariant; name: string; blurb: string }[] = [
  { id: "packet", name: "Request packet (recommended)", blurb: "A brand-blue packet rides the infinity ribbon — the same request motif as the 3D stack. Says 'traffic is flowing', not 'please wait'." },
  { id: "draw", name: "Draw-on", blurb: "The outline draws itself, then fills with the purple→blue gradient. Premium on first paint; best for a short one-shot, not a long loop." },
  { id: "shimmer", name: "Gradient sweep", blurb: "Light sweeps across the solid mark. Subtle; good for small inline states (buttons, cards)." },
  { id: "pulse", name: "Breathing glow", blurb: "Soft glow pulse. Lowest-key option for background fetches." },
];

export default function LoaderPreviewPage() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>Internal preview</Eyebrow>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">Logo loader variants</h1>
        <p className="mt-4 text-text-secondary">Every variant narrates named stages beneath the mark (the site rule: a timeline, not a spinner). Reduced-motion users get the static mark + final stage.</p>
      </div>
      <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2">
        {VARIANTS.map((v) => (
          <div key={v.id} className="flex flex-col items-center rounded-2xl border-2 border-border bg-card p-8 text-center">
            <LogoLoader variant={v.id} size={120} />
            <h2 className="mt-6 text-lg font-semibold text-text-primary">{v.name}</h2>
            <p className="mt-2 text-sm text-text-secondary">{v.blurb}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
