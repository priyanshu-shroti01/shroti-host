import type { NextConfig } from "next";

// Report-only first: violations show up in DevTools (and any report endpoint
// we add later) without breaking the site. Promote to enforcing CSP once the
// console is clean for a release. GA4 hosts are allowed because analytics is
// loaded from www.googletagmanager.com; portal.shrotihost.in receives the
// WHMCS forms.
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://www.googletagmanager.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self' https://portal.shrotihost.in",
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy-Report-Only", value: CSP_REPORT_ONLY },
];

const nextConfig: NextConfig = {
  // Self-hosted deployment: bundle a minimal server into .next/standalone
  output: "standalone",
  // Apache (mod_brotli + mod_deflate) negotiates encoding per client; Next
  // pre-gzipping would lock every client to gzip.
  compress: false,
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // API responses are per-request and may carry form feedback — never cache.
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
    ];
  },
  async redirects() {
    return [
      // /legal has no content of its own; Terms is the canonical entry point.
      { source: "/legal", destination: "/legal/terms", permanent: true },
    ];
  },
};

export default nextConfig;
