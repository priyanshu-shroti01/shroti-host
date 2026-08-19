import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/section";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { PostCard } from "@/components/blog/post-card";
import { allCategories, postsByCategory } from "@/lib/blog";
import { breadcrumbJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return allCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await props.params;
  const match = allCategories().find((c) => c.slug === category);
  if (!match) return {};
  return {
    title: `${match.name} Articles`,
    description: `Practical, honest guides on ${match.name.toLowerCase()} from the ShrotiHost team — written for people building on the web in India.`,
    alternates: { canonical: `/blog/category/${match.slug}` },
  };
}

export default async function CategoryPage(props: { params: Promise<{ category: string }> }) {
  const { category } = await props.params;
  const match = allCategories().find((c) => c.slug === category);
  if (!match) notFound();
  const posts = postsByCategory(category);

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: match.name, path: `/blog/category/${match.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <Section backdrop={<HeroAtmosphere />} className="pt-10 sm:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Category</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
              {match.name}
            </span>{" "}
            articles
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">
            {posts.length} {posts.length === 1 ? "article" : "articles"} in this topic.
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
            <PostCard key={post.slug} post={post} delay={i * 0.06} />
          ))}
        </div>
      </Section>
    </>
  );
}
