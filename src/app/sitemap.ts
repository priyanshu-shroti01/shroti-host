import type { MetadataRoute } from "next";
import { allCategories, allTags, blogPosts } from "@/lib/blog";

const SITE_URL = "https://shrotihost.in";

/** Every indexable page route. Add new pages here when adding them to src/app.
 *  Blog posts are appended automatically from lib/blog.ts.
 *  `/status` is deliberately absent — it is a noindex pre-launch preview. */
const routes: { path: string; changeFrequency: "weekly" | "monthly" | "yearly"; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/hosting", changeFrequency: "weekly", priority: 0.9 },
  { path: "/wordpress-hosting", changeFrequency: "weekly", priority: 0.9 },
  { path: "/unlimited-hosting", changeFrequency: "weekly", priority: 0.9 },
  { path: "/reseller-hosting", changeFrequency: "weekly", priority: 0.9 },
  { path: "/master-reseller-hosting", changeFrequency: "monthly", priority: 0.6 },
  { path: "/alpha-reseller-hosting", changeFrequency: "monthly", priority: 0.6 },
  { path: "/domains", changeFrequency: "weekly", priority: 0.8 },
  { path: "/vps", changeFrequency: "monthly", priority: 0.6 },
  { path: "/whmcs-gateway-fees-allocator", changeFrequency: "monthly", priority: 0.6 },
  { path: "/whmcs-whatsapp-notification-module", changeFrequency: "monthly", priority: 0.6 },
  { path: "/web-development", changeFrequency: "weekly", priority: 0.9 },
  { path: "/app-development", changeFrequency: "weekly", priority: 0.9 },
  { path: "/ecommerce-development", changeFrequency: "weekly", priority: 0.8 },
  { path: "/saas-development", changeFrequency: "weekly", priority: 0.8 },
  { path: "/custom-software", changeFrequency: "weekly", priority: 0.8 },
  { path: "/portfolio", changeFrequency: "monthly", priority: 0.6 },
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
  { path: "/careers", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/legal/terms", changeFrequency: "yearly", priority: 0.2 },
  { path: "/legal/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/legal/refund-policy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/legal/aup", changeFrequency: "yearly", priority: 0.2 },
];

/**
 * `lastModified` is only emitted where a real date exists (blog posts).
 * Static routes, categories and tags used to report the build timestamp,
 * which tells crawlers "everything changed" on every deploy — worse than
 * saying nothing.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...routes.map(({ path, changeFrequency, priority }) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency,
      priority,
    })),
    ...blogPosts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updated ?? post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...allCategories().map((c) => ({
      url: `${SITE_URL}/blog/category/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
    ...allTags().map((t) => ({
      url: `${SITE_URL}/blog/tag/${t.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.3,
    })),
  ];
}
