import Link from "next/link";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Root not-found: renders inside the normal layout (header, footer, theme)
// for every unmatched URL, replacing the stock Next.js 404 card.
export default function NotFound() {
  return (
    <Section backdrop={<HeroAtmosphere />} className="pt-10 sm:pt-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge tone="neutral">404</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
          Nothing hosted here.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">
          The page you&apos;re looking for moved, was renamed, or never existed.
          Everything else is running fine.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/" size="lg">
            Back to Home
          </Button>
          <Button href="/hosting" variant="secondary" size="lg">
            View Hosting Plans
          </Button>
        </div>
        <p className="mt-8 text-sm text-text-muted">
          Looking for something specific? Try{" "}
          <Link href="/domains" className="font-medium text-brand-purple-text hover:underline">
            domains
          </Link>
          ,{" "}
          <Link href="/blog" className="font-medium text-brand-purple-text hover:underline">
            the blog
          </Link>
          , or{" "}
          <Link href="/contact" className="font-medium text-brand-purple-text hover:underline">
            contact us
          </Link>
          .
        </p>
      </div>
    </Section>
  );
}
