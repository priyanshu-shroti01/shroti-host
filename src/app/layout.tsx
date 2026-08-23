import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeScript } from "@/components/theme-script";
import { Analytics } from "@/components/analytics";
import { CurrencyProvider } from "@/components/currency-provider";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChatbotWidgetLoader } from "@/components/chatbot/chatbot-widget-loader";
import { MobileStickyCta } from "@/components/layout/mobile-sticky-cta";
import { WelcomeOffer } from "@/components/layout/welcome-offer";
import { LenisRoot } from "@/components/motion/lenis-root";
import { GA_LINKER_DOMAINS, GA_MEASUREMENT_ID } from "@/lib/analytics";
import { organizationJsonLd, SITE_URL, websiteJsonLd } from "@/lib/seo";

// Plus Jakarta Sans is the body face (globals.css `--font-sans`), so it is the
// one family worth preloading — it paints every H1 above the fold.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  // Not above-the-fold on most pages — load on use, don't block first paint.
  preload: false,
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ShrotiHost — Web Hosting & Domains in India",
    template: "%s | ShrotiHost",
  },
  description:
    "ShrotiHost is an Indian web hosting and development company — NVMe shared, WordPress, unlimited and reseller hosting from ₹39/mo, domains, and custom builds.",
  // Only site-wide Open Graph / Twitter fields live here. Title, description
  // and url resolve per page, so sub-pages never inherit the homepage card.
  openGraph: {
    siteName: "ShrotiHost",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

// Light/dark follow `--color-bg` in globals.css. Note the site's own theme is
// controlled by `data-theme` (dark by default, see ThemeScript); these media
// entries are the closest the theme-color meta can get to that.
export const viewport: Viewport = {
  // Theme is data-theme driven (dark is the brand default), so a single value
  // is more accurate than prefers-color-scheme media entries.
  themeColor: "#0a0a0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Checkout lives on the portal subdomain — warm the connection early. */}
        <link rel="preconnect" href="https://portal.shrotihost.in" />
        <ThemeScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col overflow-x-hidden bg-bg text-text-primary">
        {/* GA4 with cross-domain linking to the WHMCS portal so a session
            survives the checkout hand-off. The initial page_view comes from
            this config; client-side route changes are reported by <Analytics />. */}
        <Script
          id="ga4-lib"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', ${JSON.stringify(GA_MEASUREMENT_ID)}, ${JSON.stringify({
            linker: { domains: [...GA_LINKER_DOMAINS] },
            anonymize_ip: true,
            send_page_view: true,
          })});`}
        </Script>
        <Analytics />
        {/* Scroll-reveal components server-render with inline opacity/transform
            hiding states that only JS animates away. Without JS those styles
            never clear, so force them visible — scoped to inline styles, which
            is exactly where framer-motion writes them. */}
        <noscript>
          <style>{`[style*="opacity"],[style*="transform"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <CurrencyProvider>
          {/* Smoothed native scroll + the site's single GSAP ticker loop.
              Renders nothing; owns window scroll (see docs/motion-system.md). */}
          <LenisRoot />
          <a
            href="#main"
            className="sr-only z-[100] rounded-full bg-brand-purple px-5 py-2.5 font-bold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            Skip to content
          </a>
          <AnnouncementBar />
          <Header />
          <main id="main" className="flex-1 overflow-x-clip">{children}</main>
          <Footer />
          <ChatbotWidgetLoader />
          <MobileStickyCta />
          <WelcomeOffer />
        </CurrencyProvider>
      </body>
    </html>
  );
}
