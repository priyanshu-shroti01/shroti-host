import { Accordion } from "@/components/ui/accordion";

export type FaqItem = { question: string; answer: string };

/** Site-wide default set — the homepage and any page without line-specific questions. */
export const faqs: FaqItem[] = [
  {
    question: "Is migration really free?",
    answer:
      "Yes. Our team migrates your website, files, and databases from your current host at no extra cost, on every hosting plan.",
  },
  {
    question: "Can I upgrade my plan later?",
    answer:
      "Yes. You can move from Bronze to Diamond at any time without migrating your website to a new server.",
  },
  {
    question: "What billing cycles do you offer?",
    answer:
      "Monthly, 3 months, 6 months, or annual — pick whichever fits, with the same renewal price shown upfront on every cycle.",
  },
  {
    question: "What happens after my plan renews?",
    answer:
      "Renewal pricing is always shown clearly before you purchase, so there are no surprises at renewal time.",
  },
  {
    question: "Do you support WordPress?",
    answer:
      "Yes. Every plan includes LiteSpeed Cache and one-click WordPress installation via Softaculous. Our dedicated WordPress Hosting plan adds further performance optimizations.",
  },
];

function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * FAQ block + matching FAQPage schema. Pass `items` so each hosting line
 * answers its own questions — identical FAQPage markup on every page is
 * treated as boilerplate, not as help.
 */
export function Faq({ items = faqs }: { items?: FaqItem[] }) {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(items)) }}
      />
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="mx-auto mt-12 max-w-2xl">
        <Accordion items={items.map((f) => ({ q: f.question, a: f.answer }))} />
      </div>
    </div>
  );
}
