"use client";

import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState({ projects: 0, blogPosts: 0, pageViews: 0 });

  useEffect(() => {
    fetch("/api/admin/projects").then(r => r.json()).then(data => {
      setStats(prev => ({ ...prev, projects: Array.isArray(data) ? data.length : 0 }));
    }).catch(() => {});

    fetch("/api/admin/blog").then(r => r.json()).then(data => {
      setStats(prev => ({ ...prev, blogPosts: Array.isArray(data) ? data.length : 0 }));
    }).catch(() => {});

    fetch("/api/admin/analytics?period=all").then(r => r.json()).then(data => {
      setStats(prev => ({ ...prev, pageViews: data.totalViews || 0 }));
    }).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface p-6">
          <p className="text-sm text-muted">Projects</p>
          <p className="mt-2 text-3xl font-bold">{stats.projects}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-6">
          <p className="text-sm text-muted">Blog Posts</p>
          <p className="mt-2 text-3xl font-bold">{stats.blogPosts}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-6">
          <p className="text-sm text-muted">Page Views</p>
          <p className="mt-2 text-3xl font-bold">{stats.pageViews}</p>
        </div>
      </div>
    </div>
  );
}
