import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/section";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { allCategories, blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Hosting Guides & Tutorials",
  description:
    "Practical guides on web hosting, WordPress speed, domains, and building a hosting business in India — written by the ShrotiHost team.",
  alternates: { canonical: "/blog" },
};

const dateFormat = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function BlogIndexPage() {
  const posts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Section backdrop={<HeroAtmosphere />} className="pt-10 sm:pt-20">
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>Blog</Eyebrow>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
          Guides that get you{" "}
          <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">online</span>.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">
          Hosting, domains, VPS, and building for the web — practical, honest, and written for
          India.
        </p>
        <nav aria-label="Categories" className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {allCategories().map((c) => (
            <Link
              key={c.slug}
              href={`/blog/category/${c.slug}`}
              className="rounded-full border-2 border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-text-secondary transition-colors hover:border-brand-purple hover:text-brand-purple"
            >
              {c.name} <span className="text-text-muted">({c.count})</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.06} className="h-full">
            <SpotlightCard className="h-full">
              <Link href={`/blog/${post.slug}`} className="flex h-full flex-col p-6">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex rounded-full border border-brand-purple/30 bg-brand-purple/5 px-2.5 py-0.5 text-xs font-medium text-brand-purple">
                    {post.category}
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="text-text-muted opacity-0 transition-all duration-200 group-hover:text-brand-purple group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </div>
                <h2 className="mt-4 text-base font-semibold leading-snug text-text-primary">
                  {post.title}
                </h2>
                <p className="mt-2 flex-1 text-sm text-text-secondary">{post.description}</p>
                <p className="mt-4 flex items-center gap-2 text-xs text-text-muted">
                  <Clock3 size={12} aria-hidden="true" />
                  {post.readMinutes} min read · {dateFormat.format(new Date(post.date))}
                </p>
              </Link>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
