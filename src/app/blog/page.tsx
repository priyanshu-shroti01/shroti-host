import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/section";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { PostCard } from "@/components/blog/post-card";
import { allCategories, blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Hosting Guides & Tutorials",
  description:
    "Practical guides on web hosting, WordPress speed, domains, and building a hosting business in India — written by the ShrotiHost team.",
  alternates: { canonical: "/blog" },
};

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
              className="rounded-full border-2 border-border bg-card px-3.5 py-2.5 text-xs font-semibold text-text-secondary transition-colors hover:border-brand-purple hover:text-brand-purple-text"
            >
              {c.name} <span className="text-text-muted">({c.count})</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <PostCard key={post.slug} post={post} delay={(i % 3) * 0.06} />
        ))}
      </div>
    </Section>
  );
}
