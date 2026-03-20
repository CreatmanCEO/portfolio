"use client";

import { useState, useEffect } from "react";
import MarkdownPreview from "./MarkdownPreview";

interface ContentData {
  [key: string]: string;
}

export default function ContentEditor() {
  const [content, setContent] = useState<ContentData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ section: string; type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch("/api/admin/content");
      const data = await res.json();
      setContent(data);
    } catch (error) {
      console.error("Failed to fetch content:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveKeys = async (section: string, keys: string[]) => {
    setSaving(section);
    setMessage(null);

    try {
      for (const key of keys) {
        const res = await fetch("/api/admin/content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value: content[key] || "" }),
        });
        if (!res.ok) throw new Error(`Failed to save ${key}`);
      }
      setMessage({ section, type: "success", text: "Saved successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ section, type: "error", text: "Failed to save. Try again." });
    } finally {
      setSaving(null);
    }
  };

  const updateField = (key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return <div className="text-muted">Loading content...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Hero Subtitle */}
      <ContentSection
        title="Hero Subtitle"
        section="hero"
        saving={saving}
        message={message}
        onSave={() => saveKeys("hero", ["hero_subtitle_en", "hero_subtitle_ru"])}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">English</label>
            <textarea
              value={content.hero_subtitle_en || ""}
              onChange={(e) => updateField("hero_subtitle_en", e.target.value)}
              rows={5}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Russian</label>
            <textarea
              value={content.hero_subtitle_ru || ""}
              onChange={(e) => updateField("hero_subtitle_ru", e.target.value)}
              rows={5}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
      </ContentSection>

      {/* About Me -- with markdown preview */}
      <ContentSection
        title="About Me"
        section="about"
        saving={saving}
        message={message}
        onSave={() => saveKeys("about", ["about_en", "about_ru"])}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">English (Markdown)</label>
            <textarea
              value={content.about_en || ""}
              onChange={(e) => updateField("about_en", e.target.value)}
              rows={10}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Preview</label>
            <div className="rounded-lg border border-border bg-background p-3 min-h-[200px]">
              <MarkdownPreview content={content.about_en || ""} />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-1 block text-xs font-medium text-muted">Russian (Markdown)</label>
          <textarea
            value={content.about_ru || ""}
            onChange={(e) => updateField("about_ru", e.target.value)}
            rows={10}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono"
          />
        </div>
      </ContentSection>

      {/* Tech Stack (JSON) */}
      <ContentSection
        title="Tech Stack"
        section="tech"
        saving={saving}
        message={message}
        onSave={() => saveKeys("tech", ["tech_stack"])}
      >
        <label className="mb-1 block text-xs font-medium text-muted">{"JSON: { primary: [...], secondary: [...] }"}</label>
        <textarea
          value={content.tech_stack || ""}
          onChange={(e) => updateField("tech_stack", e.target.value)}
          rows={6}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono"
        />
      </ContentSection>

      {/* Quick Facts (JSON) */}
      <ContentSection
        title="Quick Facts"
        section="facts"
        saving={saving}
        message={message}
        onSave={() => saveKeys("facts", ["quick_facts"])}
      >
        <label className="mb-1 block text-xs font-medium text-muted">{"JSON array: [{ icon, textEn, textRu }]"}</label>
        <textarea
          value={content.quick_facts || ""}
          onChange={(e) => updateField("quick_facts", e.target.value)}
          rows={6}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono"
        />
      </ContentSection>

      {/* Meta */}
      <ContentSection
        title="SEO / Meta"
        section="meta"
        saving={saving}
        message={message}
        onSave={() => saveKeys("meta", ["meta_title", "meta_description"])}
      >
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Page Title</label>
            <input
              type="text"
              value={content.meta_title || ""}
              onChange={(e) => updateField("meta_title", e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Meta Description</label>
            <textarea
              value={content.meta_description || ""}
              onChange={(e) => updateField("meta_description", e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
      </ContentSection>

      {/* Footer Contacts */}
      <ContentSection
        title="Footer Contacts"
        section="footer"
        saving={saving}
        message={message}
        onSave={() => saveKeys("footer", ["footer_github", "footer_telegram", "footer_linkedin", "footer_email"])}
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">GitHub URL</label>
            <input
              type="text"
              value={content.footer_github || ""}
              onChange={(e) => updateField("footer_github", e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Telegram URL</label>
            <input
              type="text"
              value={content.footer_telegram || ""}
              onChange={(e) => updateField("footer_telegram", e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">LinkedIn URL</label>
            <input
              type="text"
              value={content.footer_linkedin || ""}
              onChange={(e) => updateField("footer_linkedin", e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Email</label>
            <input
              type="text"
              value={content.footer_email || ""}
              onChange={(e) => updateField("footer_email", e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
      </ContentSection>
    </div>
  );
}

// Reusable section wrapper
function ContentSection({
  title,
  section,
  saving,
  message,
  onSave,
  children,
}: {
  title: string;
  section: string;
  saving: string | null;
  message: { section: string; type: string; text: string } | null;
  onSave: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        <button
          onClick={onSave}
          disabled={saving === section}
          className="rounded-lg bg-accent px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving === section ? "Saving..." : "Save"}
        </button>
      </div>
      {children}
      {message?.section === section && (
        <div className={`mt-3 text-xs ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
