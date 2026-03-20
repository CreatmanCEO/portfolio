import Link from "next/link";

interface BlogPost {
  slug: string;
  titleEn: string;
  excerpt: string | null;
  coverImage: string | null;
  source: string;
  externalUrl: string | null;
  publishedAt: string | null;
}

const sourceBadges: Record<string, { label: string; bg: string; text: string }> = {
  original: { label: "Original", bg: "bg-accent/10", text: "text-accent" },
  devto: { label: "Dev.to", bg: "bg-blue-100 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-400" },
  hashnode: { label: "Hashnode", bg: "bg-purple-100 dark:bg-purple-900/20", text: "text-purple-700 dark:text-purple-400" },
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function estimateReadingTime(excerpt: string | null): string {
  if (!excerpt) return "1 min read";
  const words = excerpt.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function CardContent({ post }: { post: BlogPost }) {
  const badge = sourceBadges[post.source] || sourceBadges.original;
  const isExternal = post.source !== "original" && post.externalUrl;

  return (
    <>
      {post.coverImage && (
        <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-surface">
          <img
            src={post.coverImage}
            alt={post.titleEn}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="mb-2 flex items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${badge.bg} ${badge.text}`}>
          {badge.label}
        </span>
        {post.publishedAt && (
          <span className="text-xs text-muted">{formatDate(post.publishedAt)}</span>
        )}
        <span className="text-xs text-muted">&middot; {estimateReadingTime(post.excerpt)}</span>
      </div>

      <h3 className="mb-2 text-sm font-medium group-hover:text-accent transition-colors">
        {post.titleEn}
      </h3>

      {post.excerpt && (
        <p className="text-xs leading-relaxed text-muted line-clamp-2">
          {post.excerpt}
        </p>
      )}

      {isExternal && (
        <span className="mt-auto pt-3 text-xs text-muted">
          Read on {badge.label} &rarr;
        </span>
      )}
    </>
  );
}

export default function BlogCard({ post }: { post: BlogPost }) {
  const isExternal = post.source !== "original" && post.externalUrl;
  const className = "group flex flex-col rounded-xl border border-border bg-background p-5 transition-colors hover:border-accent/50";

  if (isExternal) {
    return (
      <a
        href={post.externalUrl!}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        <CardContent post={post} />
      </a>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className={className}>
      <CardContent post={post} />
    </Link>
  );
}
