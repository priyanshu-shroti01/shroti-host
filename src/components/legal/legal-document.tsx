import type { ReactNode } from "react";
import type { LegalDoc } from "@/lib/legal-content";

/**
 * Renders a LegalDoc's markdown-lite body: `## ` headings, `- ` list items,
 * `**bold**` spans, blank-line paragraph breaks. Deliberately tiny — legal
 * pages don't justify a markdown dependency.
 */

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-text-primary">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

export function LegalDocument({ doc }: { doc: LegalDoc }) {
  const blocks = doc.body.trim().split(/\n\n+/);

  return (
    <article className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
        {doc.title}
      </h1>

      <div className="mt-8 space-y-6">
        {blocks.map((block, i) => {
          const lines = block.split("\n");
          const heading = lines[0].startsWith("## ") ? lines[0].slice(3) : null;
          const rest = heading ? lines.slice(1) : lines;
          const listItems = rest.filter((l) => l.startsWith("- "));
          const paragraphs = rest.filter((l) => !l.startsWith("- ") && l.trim() !== "");

          return (
            <section key={i}>
              {heading && (
                <h2 className="text-lg font-semibold text-text-primary">{heading}</h2>
              )}
              {paragraphs.map((p, j) => (
                <p key={j} className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {renderInline(p)}
                </p>
              ))}
              {listItems.length > 0 && (
                <ul className="mt-2 list-disc space-y-1.5 pl-5">
                  {listItems.map((item, j) => (
                    <li key={j} className="text-sm leading-relaxed text-text-secondary">
                      {renderInline(item.slice(2))}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </article>
  );
}
