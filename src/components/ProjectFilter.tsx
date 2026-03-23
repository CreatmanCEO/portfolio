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
    <div className="mb-8 grid grid-cols-3 gap-2 sm:grid-cols-4 md:flex md:flex-wrap md:justify-center md:gap-2">
      {allTags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagChange(tag)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors text-center ${
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
