import { List } from "lucide-react";
import type { BlogPost } from "@/lib/blog";
import { headingId } from "@/components/blog/post-body";

/**
 * In-article table of contents — server-rendered anchor list. Only shown
 * when a post has enough headings for jumping to be genuinely useful.
 */
export function PostToc({ post }: { post: BlogPost }) {
  const headings = post.sections
    .map((s) => s.heading)
    .filter((h): h is string => Boolean(h));

  if (headings.length < 4) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="rounded-2xl border border-border bg-card p-5"
    >
      <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-text-muted">
        <List size={13} aria-hidden="true" />
        In this article
      </p>
      <ol className="mt-3 space-y-2">
        {headings.map((heading) => (
          <li key={heading}>
            <a
              href={`#${headingId(heading)}`}
              className="text-sm text-text-secondary underline-offset-2 transition-colors hover:text-brand-purple hover:underline"
            >
              {heading}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
