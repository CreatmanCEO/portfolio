"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Project {
  id: number;
  slug: string;
  titleEn: string;
  status: string;
  year: number;
  tags: string;
  sortOrder: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      if (res.ok) {
        setProjects(await res.json());
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      alert("Failed to delete project");
    }
  };

  const parseTags = (tagsJson: string): string[] => {
    try {
      return JSON.parse(tagsJson);
    } catch {
      return [];
    }
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      production: "bg-green-500/10 text-green-600",
      in_development: "bg-yellow-500/10 text-yellow-600",
      concept: "bg-blue-500/10 text-blue-600",
    };
    return colors[status] || "bg-gray-500/10 text-gray-600";
  };

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
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link
          href="/creatsetup/projects/new"
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-lg border border-border p-12 text-center text-muted">
          No projects yet. Create your first one!
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
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted">
                  Year
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted">
                  Tags
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-surface/50">
                  <td className="px-4 py-3 font-medium">
                    {project.titleEn}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(project.status)}`}
                    >
                      {project.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{project.year}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {parseTags(project.tags)
                        .slice(0, 3)
                        .map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-accent/10 px-1.5 py-0.5 text-xs text-accent"
                          >
                            {tag}
                          </span>
                        ))}
                      {parseTags(project.tags).length > 3 && (
                        <span className="text-xs text-muted">
                          +{parseTags(project.tags).length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/creatsetup/projects/${project.id}`}
                        className="rounded p-1 text-muted transition-colors hover:bg-accent/10 hover:text-accent"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() =>
                          handleDelete(project.id, project.titleEn)
                        }
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
