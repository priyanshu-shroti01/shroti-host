import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import type { BlogPost } from "@/lib/blog";

const dateFormat = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** The one post card — shared by the blog index and every archive page. */
export function PostCard({ post, delay = 0 }: { post: BlogPost; delay?: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <SpotlightCard className="h-full">
        <Link href={`/blog/${post.slug}`} className="flex h-full flex-col p-6">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex rounded-full border border-brand-purple/30 bg-brand-purple/5 px-2.5 py-0.5 text-xs font-medium text-brand-purple">
              {post.category}
            </span>
            <ArrowUpRight
              size={16}
              className="text-text-muted opacity-0 transition-all duration-200 group-hover:text-brand-purple-text group-hover:opacity-100"
              aria-hidden="true"
            />
          </div>
          <h2 className="mt-4 text-base font-semibold leading-snug text-text-primary">
            {post.title}
          </h2>
          <p className="mt-2 flex-1 text-sm text-text-secondary">{post.description}</p>
          <p className="mt-4 flex items-center gap-2 text-xs text-text-muted">
            <Clock3 size={12} aria-hidden="true" />
            {post.readMinutes} min read ·{" "}
            <time dateTime={post.date}>{dateFormat.format(new Date(post.date))}</time>
          </p>
        </Link>
      </SpotlightCard>
    </Reveal>
  );
}
