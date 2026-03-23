"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ExternalLink, RefreshCw } from "lucide-react";

interface BlogPost {
  id: number;
  slug: string;
  titleEn: string;
  source: string;
  externalUrl: string | null;
  published: boolean;
  publishedAt: string | null;
}

type TabFilter = "all" | "original" | "aggregated";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [aggregating, setAggregating] = useState(false);
  const [aggregateMsg, setAggregateMsg] = useState("");
  const [tab, setTab] = useState<TabFilter>("all");

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/admin/blog");
      if (res.ok) {
        setPosts(await res.json());
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAggregate = async () => {
    setAggregating(true);
    setAggregateMsg("");
    try {
      const res = await fetch("/api/admin/blog/aggregate", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setAggregateMsg(data.message);
        // Refresh the list
        setLoading(true);
        await fetchPosts();
      } else {
        setAggregateMsg(data.error || "Aggregation failed");
      }
    } catch {
      setAggregateMsg("Aggregation failed");
    } finally {
      setAggregating(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      alert("Failed to delete post");
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (tab === "original") return post.source === "original";
    if (tab === "aggregated") return post.source !== "original";
    return true;
  });

  const sourceBadge = (source: string) => {
    const styles: Record<string, string> = {
      original: "bg-blue-500/10 text-blue-600",
      devto: "bg-purple-500/10 text-purple-600",
      hashnode: "bg-cyan-500/10 text-cyan-600",
    };
    return styles[source] || "bg-gray-500/10 text-gray-600";
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "--";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const tabs: { key: TabFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "original", label: "Original" },
    { key: "aggregated", label: "Aggregated" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAggregate}
            disabled={aggregating}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${aggregating ? "animate-spin" : ""}`}
            />
            {aggregating ? "Fetching..." : "Aggregate from Dev.to / Hashnode"}
          </button>
          <Link
            href="/creatsetup/blog/new"
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New Original Post
          </Link>
        </div>
      </div>

      {aggregateMsg && (
        <div className="mb-4 rounded-lg border border-border bg-surface px-4 py-2 text-sm">
          {aggregateMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-lg border border-border bg-surface p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="rounded-lg border border-border p-12 text-center text-muted">
          {tab === "original"
            ? "No original posts yet. Create your first one!"
            : tab === "aggregated"
              ? 'No aggregated posts yet. Click "Aggregate" to fetch from Dev.to / Hashnode.'
              : "No blog posts yet."}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted">
                  Title
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted">
                  Source
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-surface/50">
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-2">
                      {post.titleEn}
                      {post.externalUrl && (
                        <a
                          href={post.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted hover:text-accent"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${sourceBadge(post.source)}`}
                    >
                      {post.source}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {formatDate(post.publishedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        post.published
                          ? "bg-green-500/10 text-green-600"
                          : "bg-yellow-500/10 text-yellow-600"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/creatsetup/blog/${post.id}`}
                        className="rounded p-1 text-muted transition-colors hover:bg-accent/10 hover:text-accent"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.titleEn)}
                        className="rounded p-1 text-muted transition-colors hover:bg-red-500/10 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
