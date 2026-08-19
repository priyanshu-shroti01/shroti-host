import Link from "next/link";
import type { ReactNode } from "react";
import type { BlogPost } from "@/lib/blog";

/**
 * Server-rendered post body. The only inline syntax is [text](href) —
 * internal hrefs become Next links, external ones plain anchors.
 */

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

export function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  while ((match = LINK_RE.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const [, label, href] = match;
    nodes.push(
      href.startsWith("/") ? (
        <Link
          key={`${href}-${match.index}`}
          href={href}
          className="font-medium text-brand-purple underline-offset-2 hover:underline"
        >
          {label}
        </Link>
      ) : (
        <a
          key={`${href}-${match.index}`}
          href={href}
          className="font-medium text-brand-purple underline-offset-2 hover:underline"
        >
          {label}
        </a>
      )
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

/** Anchor id for a section heading — shared with the table of contents. */
export function headingId(heading: string): string {
  return heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function PostBody({ post }: { post: BlogPost }) {
  return (
    <div className="space-y-8">
      {post.sections.map((section, i) => (
        <section key={i}>
          {section.heading && (
            <h2
              id={headingId(section.heading)}
              className="scroll-mt-24 text-xl font-semibold tracking-tight text-text-primary sm:text-2xl"
            >
              {section.heading}
            </h2>
          )}
          {section.paragraphs?.map((p, j) => (
            <p key={j} className="mt-3 leading-relaxed text-text-secondary">
              {renderInline(p)}
            </p>
          ))}
          {section.list && (
            <ul
              className={`mt-4 space-y-2 pl-5 ${
                section.ordered ? "list-decimal" : "list-disc"
              } marker:text-brand-purple`}
            >
              {section.list.map((item, j) => (
                <li key={j} className="leading-relaxed text-text-secondary">
                  {renderInline(item)}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {post.faq && post.faq.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
            Frequently asked questions
          </h2>
          <div className="mt-4 space-y-4">
            {post.faq.map((item) => (
              <div key={item.q} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-sm font-semibold text-text-primary">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
