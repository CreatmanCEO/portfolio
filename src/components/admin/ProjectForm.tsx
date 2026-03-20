"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const allTags = [
  "security",
  "ai",
  "automation",
  "devtools",
  "fintech",
  "infra",
  "marketplace",
  "business-tool",
  "mobile",
  "bot",
  "opensource",
];

interface ProjectData {
  id?: number;
  titleEn: string;
  titleRu: string;
  slug: string;
  descriptionEn: string;
  descriptionRu: string;
  tags: string[];
  techStack: string[];
  status: string;
  year: number;
  githubUrl: string;
  liveUrl: string;
  sortOrder: number;
}

interface ProjectFormProps {
  initialData?: ProjectData;
  isEdit?: boolean;
}

export default function ProjectForm({ initialData, isEdit }: ProjectFormProps) {
  const router = useRouter();
  const [data, setData] = useState<ProjectData>(
    initialData || {
      titleEn: "",
      titleRu: "",
      slug: "",
      descriptionEn: "",
      descriptionRu: "",
      tags: [],
      techStack: [],
      status: "production",
      year: new Date().getFullYear(),
      githubUrl: "",
      liveUrl: "",
      sortOrder: 0,
    }
  );
  const [techInput, setTechInput] = useState(
    initialData?.techStack?.join(", ") || ""
  );
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
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

  const toggleTag = (tag: string) => {
    setData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleGenerate = async () => {
    if (!data.githubUrl) {
      setMessage({ type: "error", text: "Enter GitHub URL first" });
      return;
    }
    setGenerating(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/projects/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubUrl: data.githubUrl }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }
      const generated = await res.json();
      setData((prev) => ({
        ...prev,
        titleEn: generated.titleEn || prev.titleEn,
        descriptionEn: generated.descriptionEn || prev.descriptionEn,
        tags: generated.tags || prev.tags,
        techStack: generated.techStack || prev.techStack,
        status: generated.status || prev.status,
        slug: prev.slug || generateSlug(generated.titleEn || prev.titleEn),
      }));
      setTechInput((generated.techStack || []).join(", "));
      setMessage({ type: "success", text: "AI generated! Review and save." });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "AI generation unavailable",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!data.titleEn.trim()) {
      setMessage({ type: "error", text: "Title (English) is required" });
      return;
    }

    setSaving(true);
    setMessage(null);

    const techStack = techInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = { ...data, techStack };

    try {
      const url = isEdit
        ? `/api/admin/projects/${data.id}`
        : "/api/admin/projects";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      setMessage({
        type: "success",
        text: isEdit ? "Updated!" : "Created!",
      });
      if (!isEdit) {
        setTimeout(() => router.push("/creatsetup/projects"), 1000);
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

      {/* GitHub URL + Generate */}
      <div>
        <label className="mb-1 block text-xs font-medium text-muted">
          GitHub URL
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={data.githubUrl}
            onChange={(e) =>
              setData((p) => ({ ...p, githubUrl: e.target.value }))
            }
            placeholder="https://github.com/owner/repo"
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="whitespace-nowrap rounded-lg bg-accent px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {generating ? "Generating..." : "Generate from GitHub"}
          </button>
        </div>
      </div>

      {/* Description EN/RU */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">
            Description (English)
          </label>
          <textarea
            value={data.descriptionEn}
            onChange={(e) =>
              setData((p) => ({ ...p, descriptionEn: e.target.value }))
            }
            rows={5}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">
            Description (Russian)
          </label>
          <textarea
            value={data.descriptionRu}
            onChange={(e) =>
              setData((p) => ({ ...p, descriptionRu: e.target.value }))
            }
            rows={5}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Year + Status + Sort Order */}
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">
            Year
          </label>
          <input
            type="number"
            value={data.year}
            onChange={(e) =>
              setData((p) => ({
                ...p,
                year: parseInt(e.target.value) || 2024,
              }))
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">
            Status
          </label>
          <select
            value={data.status}
            onChange={(e) =>
              setData((p) => ({ ...p, status: e.target.value }))
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="production">Production</option>
            <option value="in_development">In Development</option>
            <option value="concept">Concept</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">
            Sort Order
          </label>
          <input
            type="number"
            value={data.sortOrder}
            onChange={(e) =>
              setData((p) => ({
                ...p,
                sortOrder: parseInt(e.target.value) || 0,
              }))
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="mb-2 block text-xs font-medium text-muted">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                data.tags.includes(tag)
                  ? "bg-accent text-white"
                  : "border border-border text-muted hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <label className="mb-1 block text-xs font-medium text-muted">
          Tech Stack (comma-separated)
        </label>
        <input
          type="text"
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          placeholder="Python, FastAPI, Docker, ..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Live URL */}
      <div>
        <label className="mb-1 block text-xs font-medium text-muted">
          Live URL
        </label>
        <input
          type="text"
          value={data.liveUrl}
          onChange={(e) =>
            setData((p) => ({ ...p, liveUrl: e.target.value }))
          }
          placeholder="https://..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
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
        {saving ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
      </button>
    </div>
  );
}
