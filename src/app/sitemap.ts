import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";

const SITE_URL = "https://shrotihost.in";

/** Every indexable page route. Add new pages here when adding them to src/app.
 *  Blog posts are appended automatically from lib/blog.ts. */
const routes: { path: string; changeFrequency: "weekly" | "monthly" | "yearly"; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/hosting", changeFrequency: "weekly", priority: 0.9 },
  { path: "/wordpress-hosting", changeFrequency: "weekly", priority: 0.9 },
  { path: "/unlimited-hosting", changeFrequency: "weekly", priority: 0.9 },
  { path: "/reseller-hosting", changeFrequency: "weekly", priority: 0.9 },
  { path: "/master-reseller-hosting", changeFrequency: "weekly", priority: 0.8 },
  { path: "/alpha-reseller-hosting", changeFrequency: "weekly", priority: 0.8 },
  { path: "/domains", changeFrequency: "weekly", priority: 0.8 },
  { path: "/vps", changeFrequency: "monthly", priority: 0.6 },
  { path: "/whmcs-gateway-fees-allocator", changeFrequency: "monthly", priority: 0.6 },
  { path: "/whmcs-whatsapp-notification-module", changeFrequency: "monthly", priority: 0.6 },
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
  { path: "/careers", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/status", changeFrequency: "monthly", priority: 0.4 },
  { path: "/legal/terms", changeFrequency: "yearly", priority: 0.2 },
  { path: "/legal/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/legal/refund-policy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/legal/aup", changeFrequency: "yearly", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    ...routes.map(({ path, changeFrequency, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency,
      priority,
    })),
    ...blogPosts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
