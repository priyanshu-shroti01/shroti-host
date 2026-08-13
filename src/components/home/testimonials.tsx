import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";

/**
 * Real, verified reviews from https://www.trustpilot.com/review/shrotihost.in
 * Quotes are lightly cleaned up for run-on grammar only — content, rating,
 * name, and date are unchanged from the original review. The reviewer named
 * "Priyanshu" was excluded: it's the business owner reviewing a purchase of
 * their own product, not an independent customer.
 */
const testimonials = [
  {
    quote:
      "This is a wonderful platform for buying hosting — domains here are very cheap. I'm so lucky and very happy to join this platform. Their customer support is good; nobody else provides support like ShrotiHost.in does.",
    name: "Kunal Gupta",
    location: "India",
    date: "December 2023",
  },
  {
    quote:
      "Very easy transaction, very impressed with the service — we'll definitely use it again. Saved it in bookmarks; very easy to purchase a product. Very happy, keep up the good work!",
    name: "Redenet",
    location: "United Kingdom",
    date: "February 2024",
  },
  {
    quote: "Good. Email server is fast and syncs well, just a delay of about 45 seconds.",
    name: "Gambro",
    location: "India",
    date: "February 2025",
  },
  {
    quote: "Good enough — no downtime yet.",
    name: "dis",
    location: "India",
    date: "April 2025",
  },
  {
    quote: "Nice hosting, unlimited storage.",
    name: "Debasis Patra",
    location: "India",
    date: "December 2023",
  },
];

export function Testimonials() {
  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Trusted by builders across India
        </h2>
        <p className="mt-4 text-text-secondary">Real, verified reviews from Trustpilot.</p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.06}>
            <Card className="h-full">
              <div className="flex gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, star) => (
                  <Star key={star} size={14} fill="currentColor" aria-hidden="true" />
                ))}
                <span className="sr-only">Rated 5 out of 5 stars</span>
              </div>
              <p className="mt-3 text-text-secondary">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6">
                <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                <p className="text-xs text-text-muted">
                  {t.location} · {t.date}
                </p>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>

      <div className="mt-8 text-center">
        <a
          href="https://www.trustpilot.com/review/shrotihost.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-brand-purple hover:underline"
        >
          Read verified reviews on Trustpilot ↗
        </a>
      </div>
    </div>
  );
}
