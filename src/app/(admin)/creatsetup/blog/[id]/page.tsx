"use client";

import { useEffect, useState, use } from "react";
import BlogPostForm from "@/components/admin/BlogPostForm";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

interface BlogPostRaw {
  id: number;
  slug: string;
  titleEn: string;
  titleRu: string;
  contentMd: string;
  excerpt: string | null;
  coverImage: string | null;
  source: string;
  externalUrl: string | null;
  published: boolean;
  publishedAt: string | null;
}

export default function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [post, setPost] = useState<BlogPostRaw | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/blog/${id}`);
        if (!res.ok) throw new Error("Not found");
        setPost(await res.json());
      } catch {
        setError("Blog post not found");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted">
        Loading...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="py-20 text-center text-red-600">
        {error || "Blog post not found"}
      </div>
    );
  }

  // Aggregated posts: read-only view
  if (post.source !== "original") {
    return (
      <div>
        <div className="mb-6">
          <Link
            href="/creatsetup/blog"
            className="mb-4 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
          <h1 className="text-2xl font-bold">View Aggregated Post</h1>
        </div>

        <div className="space-y-4 rounded-lg border border-border p-6">
          <div>
            <span className="text-xs font-medium text-muted">Source</span>
            <p className="mt-1">
              <span className="inline-block rounded-full bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-600">
                {post.source}
              </span>
            </p>
          </div>

          <div>
            <span className="text-xs font-medium text-muted">Title</span>
            <p className="mt-1 text-lg font-medium">{post.titleEn}</p>
          </div>

          {post.excerpt && (
            <div>
              <span className="text-xs font-medium text-muted">Excerpt</span>
              <p className="mt-1 text-sm text-muted">{post.excerpt}</p>
            </div>
          )}

          {post.publishedAt && (
            <div>
              <span className="text-xs font-medium text-muted">
                Published
              </span>
              <p className="mt-1 text-sm">
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}

          {post.externalUrl && (
            <a
              href={post.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <ExternalLink className="h-4 w-4" />
              View on {post.source === "devto" ? "Dev.to" : "Hashnode"}
            </a>
          )}
        </div>
      </div>
    );
  }

  // Original posts: full edit form
  const initialData = {
    id: post.id,
    titleEn: post.titleEn,
    titleRu: post.titleRu,
    slug: post.slug,
    contentMd: post.contentMd,
    excerpt: post.excerpt || "",
    coverImage: post.coverImage || "",
    published: post.published,
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/creatsetup/blog"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
        <h1 className="text-2xl font-bold">Edit Blog Post</h1>
      </div>
      <BlogPostForm initialData={initialData} isEdit />
    </div>
  );
}
