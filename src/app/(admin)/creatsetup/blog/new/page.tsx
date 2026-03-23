"use client";

import BlogPostForm from "@/components/admin/BlogPostForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewBlogPostPage() {
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
        <h1 className="text-2xl font-bold">New Blog Post</h1>
      </div>
      <BlogPostForm />
    </div>
  );
}
