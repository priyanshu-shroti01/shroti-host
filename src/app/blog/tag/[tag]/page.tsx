import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/section";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { allTags, postsByTag } from "@/lib/blog";
import { breadcrumbJsonLd } from "@/lib/seo";

const dateFormat = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function generateStaticParams() {
  return allTags().map((t) => ({ tag: t.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await props.params;
  const match = allTags().find((t) => t.slug === tag);
  if (!match) return {};
  return {
    title: `Articles tagged “${match.name}”`,
    description: `Every ShrotiHost guide tagged ${match.name} — practical, honest, and written for people building on the web in India.`,
    alternates: { canonical: `/blog/tag/${match.slug}` },
  };
}

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  const { tag } = await props.params;
  const match = allTags().find((t) => t.slug === tag);
  if (!match) notFound();
  const posts = postsByTag(tag);

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: `#${match.name}`, path: `/blog/tag/${match.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <Section backdrop={<HeroAtmosphere />} className="pt-10 sm:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Tag</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
              #{match.name}
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">
            {posts.length} {posts.length === 1 ? "article" : "articles"} with this tag.
          </p>
          <Link
            href="/blog"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            All articles
          </Link>
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
    </>
  );
}
