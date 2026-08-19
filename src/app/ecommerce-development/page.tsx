import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePage } from "@/components/services/service-page";
import { getService } from "@/lib/services";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo";

const service = getService("ecommerce-development");

export const metadata: Metadata = {
  title: service?.metaTitle,
  description: service?.metaDescription,
  alternates: { canonical: "/ecommerce-development" },
};

export default function Page() {
  if (!service) notFound();

  const jsonLd = serviceJsonLd(service);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: service.name, path: "/ecommerce-development" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <ServicePage service={service} />
    </>
  );
}
