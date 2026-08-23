import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/section";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { PostCard } from "@/components/blog/post-card";
import { allCategories, postsByCategory, type BlogCategory } from "@/lib/blog";
import { breadcrumbJsonLd } from "@/lib/seo";

// Categories come from the posts in lib/blog.ts — unknown slugs are real 404s.
export const dynamicParams = false;

/** Per-category meta descriptions — a template would produce "guides on guides". */
const categoryDescriptions: Record<BlogCategory, string> = {
  Guides:
    "Step-by-step guides from the ShrotiHost team — hosting a website in India, choosing a plan, connecting a domain, and going live without surprises.",
  WordPress:
    "WordPress hosting and speed guides — LiteSpeed Cache, PHP versions, plugins, images, and the hosting layer underneath — from the ShrotiHost team.",
  Business:
    "Guides on starting and running a hosting or web business in India — reseller hosting, WHMCS billing, pricing, support, and honest margins.",
  Performance:
    "Hosting performance explained — NVMe storage, LiteSpeed, caching, and what actually makes a website faster for Indian visitors.",
  Domains:
    "Domain guides for Indian businesses — .in vs .com, DNS records, nameservers, transfers, and protecting your brand name.",
  VPS:
    "VPS guides — what a virtual private server is, how it compares to shared hosting, and the real signals that it's time to upgrade.",
  Development:
    "Web and app development guides — costs in India, MVP scope, website builders vs custom builds, and launch checklists from the ShrotiHost team.",
};

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
    description: categoryDescriptions[match.name],
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
