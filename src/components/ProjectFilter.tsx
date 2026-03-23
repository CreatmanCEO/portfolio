"use client";

const allTags = [
  "all", "security", "ai", "automation", "devtools", "fintech",
  "infra", "marketplace", "business-tool", "mobile", "bot", "opensource",
];

interface ProjectFilterProps {
  activeTag: string;
  onTagChange: (tag: string) => void;
}

export default function ProjectFilter({ activeTag, onTagChange }: ProjectFilterProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-2">
      {allTags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagChange(tag)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            activeTag === tag
              ? "bg-foreground text-background"
              : "border border-border text-muted hover:text-foreground"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
