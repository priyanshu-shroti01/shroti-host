import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import { Section } from "@/components/ui/section";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { Button } from "@/components/ui/button";
import { PostBody } from "@/components/blog/post-body";
import { PostToc } from "@/components/blog/post-toc";
import { blogPosts, getPost, relatedPosts, taxonomySlug } from "@/lib/blog";
import { articleJsonLd, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";

const dateFormat = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });

// Every slug comes from lib/blog.ts — anything else is a real 404, not a
// soft-404 rendered at request time.
export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    // Post titles are already written as full <title>s — no "| ShrotiHost" suffix.
    title: { absolute: post.title },
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      siteName: "ShrotiHost",
      locale: "en_IN",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = relatedPosts(post);
  const article = articleJsonLd(post);

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.category, path: `/blog/category/${taxonomySlug(post.category)}` },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  const faqJsonLd = post.faq && {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <Section backdrop={<HeroAtmosphere />} className="pt-10 sm:pt-16">
        <article className="mx-auto max-w-2xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            All articles
          </Link>

          <header className="mt-6">
            <Link
              href={`/blog/category/${taxonomySlug(post.category)}`}
              className="inline-flex rounded-full border border-brand-purple/30 bg-brand-purple/5 px-2.5 py-0.5 text-xs font-medium text-brand-purple transition-colors hover:bg-brand-purple/10"
            >
              {post.category}
            </Link>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-text-muted">
              <Clock3 size={14} aria-hidden="true" />
              {post.readMinutes} min read ·{" "}
              <time dateTime={post.date}>{dateFormat.format(new Date(post.date))}</time>
              {post.updated && (
                <>
                  {" "}
                  · Updated <time dateTime={post.updated}>{dateFormat.format(new Date(post.updated))}</time>
                </>
              )}{" "}
              · ShrotiHost team
            </p>
          </header>

          <div className="mt-8">
            <PostToc post={post} />
          </div>

          <div className="mt-10">
            <PostBody post={post} />
          </div>

          {post.tags && post.tags.length > 0 && (
            <p className="mt-10 flex flex-wrap items-center gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${taxonomySlug(tag)}`}
                  className="rounded-full border border-border px-3 py-1 text-xs font-medium text-text-secondary transition-colors hover:border-brand-purple hover:text-brand-purple"
                >
                  #{tag}
                </Link>
              ))}
            </p>
          )}

          {/* CTA — one honest pitch at the end, matched to the post topic. */}
          <div className="mt-12 rounded-2xl border-2 border-brand-purple/25 bg-card p-6 text-center sm:p-8">
            <h2 className="text-lg font-semibold text-text-primary">{post.cta.label}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">{post.cta.blurb}</p>
            <div className="mt-5 flex justify-center">
              <Button href={post.cta.href} size="lg">
                Get started
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </div>
            <p className="mt-3 text-xs text-text-muted">
              7-day money-back guarantee · Same renewal price, every cycle
            </p>
          </div>

          {related.length > 0 && (
            <nav aria-label="Related articles" className="mt-12 border-t border-border pt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                Keep reading
              </h2>
              <ul className="mt-4 space-y-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/blog/${r.slug}`}
                      className="group inline-flex items-start gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-brand-purple"
                    >
                      <ArrowRight size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </article>
      </Section>
    </>
  );
}
