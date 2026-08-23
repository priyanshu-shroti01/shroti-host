"use client";

import { useEffect } from "react";
import Link from "next/link";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Route error boundary: renders inside the normal layout (header, footer,
// theme) when a page throws during render — e.g. a storage read in a private
// browsing session — replacing the stock Next.js error card. Mirrors the
// not-found composition so a failure still looks like the site.
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface in the console for debugging; no external error reporting yet.
    console.error(error);
  }, [error]);

  return (
    <Section backdrop={<HeroAtmosphere />} className="pt-10 sm:pt-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge tone="neutral">Error</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
          Something went wrong on this page.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">
          The rest of the site — and your hosting — is unaffected. Try loading the
          page again; if it keeps happening, tell us and we&apos;ll fix it.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button onClick={reset} size="lg">
            Try again
          </Button>
          <Button href="/" variant="secondary" size="lg">
            Back to Home
          </Button>
        </div>
        <p className="mt-8 text-sm text-text-muted">
          Still stuck?{" "}
          <Link href="/contact" className="font-medium text-brand-purple-text hover:underline">
            Contact support
          </Link>
          {error.digest && (
            <>
              {" "}
              and quote error ID <code className="font-mono">{error.digest}</code>
            </>
          )}
          .
        </p>
      </div>
    </Section>
  );
}
