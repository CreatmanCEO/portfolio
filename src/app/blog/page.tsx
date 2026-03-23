import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import BlogCard from "@/components/BlogCard";
import TranslatedText from "@/components/TranslatedText";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Creatman",
  description: "Articles about security, AI, infrastructure, and developer tools.",
};

export default function BlogPage() {
  const posts = db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.published, true))
    .orderBy(desc(blogPosts.publishedAt))
    .all();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl"><TranslatedText tKey="blog.title" /></h1>
        <p className="text-muted">
          <TranslatedText tKey="blog.subtitle" />
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-muted">No posts yet. Check back soon!</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}
