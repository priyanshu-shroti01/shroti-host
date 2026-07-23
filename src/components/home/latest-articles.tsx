import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";

/**
 * No blog posts are published yet — this links out to topics we plan to
 * cover rather than fabricating post titles, authors, or reading times.
 */
const plannedTopics = [
  { category: "Hosting", title: "How to choose the right hosting plan" },
  { category: "WordPress", title: "Speeding up WordPress with LiteSpeed Cache" },
  { category: "Students", title: "A student's guide to hosting a portfolio" },
];

export function LatestArticles() {
  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          From the Blog
        </h2>
        <p className="mt-4 text-text-secondary">
          Our blog is launching soon. Here&apos;s what we&apos;re planning to write about first.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {plannedTopics.map((topic, i) => (
          <Reveal key={topic.title} delay={(i + 1) * 0.08}>
            <div className="group h-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-[250ms] ease-[cubic-bezier(0.33,1,0.68,1)] hover:-translate-y-1 hover:border-brand-purple/40 hover:shadow-[0_12px_28px_-10px_rgb(168_16_199/0.3)]">
              <div className="flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br from-brand-purple/15 to-brand-blue/10">
                <BookOpen
                  size={28}
                  className="text-brand-purple/50 transition-transform duration-300 group-hover:scale-125"
                  aria-hidden="true"
                />
              </div>
              <div className="p-5">
                <Badge tone="neutral">{topic.category}</Badge>
                <p className="mt-3 text-sm font-medium text-text-primary">{topic.title}</p>
                <p className="mt-2 text-xs text-text-muted">Coming soon</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button href="/blog" variant="secondary" size="lg">
          Visit the Blog
        </Button>
      </div>
    </div>
  );
}
