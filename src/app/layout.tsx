import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeScript } from "@/components/theme-script";
import { CurrencyProvider } from "@/components/currency-provider";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChatbotWidget } from "@/components/chatbot/chatbot-widget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://shrotihost.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ShrotiHost — Premium, Developer-Friendly Hosting",
    template: "%s | ShrotiHost",
  },
  description:
    "Affordable, high-performance hosting for students, developers, startups, and businesses. Free SSL, LiteSpeed, daily backups, and free migration on every plan.",
  keywords: [
    "web hosting India",
    "shared hosting",
    "WordPress hosting",
    "unlimited hosting",
    "student hosting",
    "domain registration",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "ShrotiHost — Premium, Developer-Friendly Hosting",
    description:
      "Affordable, high-performance hosting for students, developers, startups, and businesses.",
    url: SITE_URL,
    siteName: "ShrotiHost",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShrotiHost — Premium, Developer-Friendly Hosting",
    description:
      "Affordable, high-performance hosting for students, developers, startups, and businesses.",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ShrotiHost",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-on-light.svg`,
  foundingDate: "2023-04-13",
  sameAs: [],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ShrotiHost",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/domains?query={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
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
      <body className="flex min-h-full flex-col bg-bg text-text-primary">
        <CurrencyProvider>
          <AnnouncementBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatbotWidget />
        </CurrencyProvider>
      </body>
    </html>
  );
}
