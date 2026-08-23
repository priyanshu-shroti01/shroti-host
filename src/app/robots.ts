import type { MetadataRoute } from "next";

const SITE_URL = "https://shrotihost.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // JSON endpoints (domain checker, intake forms, health) are not pages.
        disallow: ["/api/"],
      },
      // AI/citation crawlers (OAI-SearchBot, PerplexityBot, ClaudeBot, GPTBot,
      // Google-Extended) stay allowed on purpose — being cited is visibility.
      // Bytespider crawls aggressively and cites nothing; nothing to gain.
      { userAgent: "Bytespider", disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
