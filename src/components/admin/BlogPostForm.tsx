"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MarkdownPreview from "./MarkdownPreview";

interface BlogPostData {
  id?: number;
  titleEn: string;
  titleRu: string;
  slug: string;
  contentMd: string;
  excerpt: string;
  coverImage: string;
  published: boolean;
}

interface BlogPostFormProps {
  initialData?: BlogPostData;
  isEdit?: boolean;
}

export default function BlogPostForm({
  initialData,
  isEdit,
}: BlogPostFormProps) {
  const router = useRouter();
  const [data, setData] = useState<BlogPostData>(
    initialData || {
      titleEn: "",
      titleRu: "",
      slug: "",
      contentMd: "",
      excerpt: "",
      coverImage: "",
      published: false,
    }
  );
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setData((prev) => ({
      ...prev,
      titleEn: value,
      slug: prev.slug || generateSlug(value),
    }));
  };

  const handleSave = async () => {
    if (!data.titleEn.trim()) {
      setMessage({ type: "error", text: "Title (English) is required" });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const url = isEdit
        ? `/api/admin/blog/${data.id}`
        : "/api/admin/blog";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save");

      setMessage({
        type: "success",
        text: isEdit ? "Updated!" : "Created!",
      });
      if (!isEdit) {
        setTimeout(() => router.push("/creatsetup/blog"), 1000);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to save. Try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title + Slug */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">
            Title (English)
          </label>
          <input
            type="text"
            value={data.titleEn}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">
            Slug
          </label>
          <input
            type="text"
            value={data.slug}
            onChange={(e) =>
              setData((p) => ({ ...p, slug: e.target.value }))
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono"
          />
        </div>
      </div>

      {/* Title RU */}
      <div>
        <label className="mb-1 block text-xs font-medium text-muted">
          Title (Russian)
        </label>
        <input
          type="text"
          value={data.titleRu}
          onChange={(e) =>
            setData((p) => ({ ...p, titleRu: e.target.value }))
          }
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className="mb-1 block text-xs font-medium text-muted">
          Excerpt
        </label>
        <textarea
          value={data.excerpt}
          onChange={(e) =>
            setData((p) => ({ ...p, excerpt: e.target.value }))
          }
          rows={2}
          placeholder="Brief summary of the post..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Cover Image URL */}
      <div>
        <label className="mb-1 block text-xs font-medium text-muted">
          Cover Image URL
        </label>
        <input
          type="text"
          value={data.coverImage}
          onChange={(e) =>
            setData((p) => ({ ...p, coverImage: e.target.value }))
          }
          placeholder="https://..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Content (Markdown) */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-xs font-medium text-muted">
            Content (Markdown)
          </label>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs text-accent hover:underline"
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
        </div>
        {showPreview ? (
          <div className="min-h-[300px] rounded-lg border border-border bg-background p-4">
            <MarkdownPreview content={data.contentMd} />
          </div>
        ) : (
          <textarea
            value={data.contentMd}
            onChange={(e) =>
              setData((p) => ({ ...p, contentMd: e.target.value }))
            }
            rows={16}
            placeholder="Write your blog post in Markdown..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm"
          />
        )}
      </div>

      {/* Published toggle */}
      <div className="flex items-center gap-3">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={data.published}
            onChange={(e) =>
              setData((p) => ({ ...p, published: e.target.checked }))
            }
            className="peer sr-only"
          />
          <div className="h-5 w-9 rounded-full bg-border after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-accent peer-checked:after:translate-x-full" />
        </label>
        <span className="text-sm text-muted">
          {data.published ? "Published" : "Draft"}
        </span>
      </div>

      {/* Message + Save */}
      {message && (
        <div
          className={`text-sm ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-lg bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Saving..." : isEdit ? "Update Post" : "Create Post"}
      </button>
    </div>
  );
}
