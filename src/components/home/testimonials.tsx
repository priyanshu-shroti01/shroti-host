import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";

/**
 * Reviews quoted from https://www.trustpilot.com/review/shrotihost.in
 * Quotes are lightly cleaned up for run-on grammar only — content, rating,
 * name, and date are unchanged from the original review. The reviewer named
 * "Priyanshu" was excluded: it's the business owner reviewing a purchase of
 * their own product, not an independent customer.
 *
 * The aggregate below is printed, not implied: update it by hand when the
 * Trustpilot page changes (last checked 2026-08-23 — 4.1/5 from 12 reviews).
 */
const TRUSTPILOT_URL = "https://www.trustpilot.com/review/shrotihost.in";
const TRUSTPILOT_AGGREGATE = { score: "4.1", reviews: 12 };

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
    <Reveal>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          What customers say
        </h2>
        <p className="mt-4 text-text-secondary">
          Quoted from Trustpilot — names and dates as published there.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <Card key={t.name} className="h-full">
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
        ))}
      </div>

      {/* The real aggregate, stated plainly next to the link — small and
          honest beats a five-star wall. */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-sm">
        <span className="text-text-secondary">
          {TRUSTPILOT_AGGREGATE.score}/5 from {TRUSTPILOT_AGGREGATE.reviews} reviews on Trustpilot
        </span>
        <a
          href={TRUSTPILOT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-purple-text hover:underline"
        >
          Read them on Trustpilot ↗
        </a>
      </div>
    </Reveal>
  );
}
