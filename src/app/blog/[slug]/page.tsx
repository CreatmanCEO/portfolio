import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import TranslatedText from "@/components/TranslatedText";
import type { Metadata } from "next";
import MarkdownRenderer from "@/components/MarkdownRenderer";

function getPost(slug: string) {
  return db
    .select()
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.slug, slug),
        eq(blogPosts.source, "original"),
        eq(blogPosts.published, true)
      )
    )
    .get();
}

export const dynamic = "force-dynamic";

/* generateStaticParams removed — pages render at runtime
export function generateStaticParams() {
  try {
    const posts = db
      .select({ slug: blogPosts.slug })
      .from(blogPosts)
      .where(
        and(eq(blogPosts.source, "original"), eq(blogPosts.published, true))
      )
      .all();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
} */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = getPost(slug);
    if (!post) return { title: "Post Not Found" };
    return {
      title: `${post.titleEn} — Creatman Blog`,
      description: post.excerpt || post.titleEn,
    };
  } catch {
    return { title: "Blog — Creatman" };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 md:py-20">
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors"
      >
        <TranslatedText tKey="blog.backToBlog" />
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">
            {post.titleEn}
          </h1>
          {formattedDate && (
            <p className="text-sm text-muted">{formattedDate}</p>
          )}
        </header>

        {post.coverImage && (
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={post.coverImage}
              alt={post.titleEn}
              className="w-full"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <MarkdownRenderer content={post.contentMd} />
        </div>
      </article>
    </main>
  );
}
