"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const tagColors: Record<string, { bg: string; text: string }> = {
  security: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-800 dark:text-red-300" },
  ai: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-800 dark:text-blue-300" },
  automation: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-800 dark:text-amber-300" },
  fintech: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-800 dark:text-amber-300" },
  devtools: { bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-800 dark:text-violet-300" },
  infra: { bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-800 dark:text-violet-300" },
  marketplace: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-800 dark:text-orange-300" },
  "business-tool": { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-800 dark:text-orange-300" },
  mobile: { bg: "bg-sky-100 dark:bg-sky-900/30", text: "text-sky-800 dark:text-sky-300" },
  bot: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-800 dark:text-emerald-300" },
  opensource: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-800 dark:text-green-300" },
};

const statusColors: Record<string, string> = {
  production: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  in_development: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  concept: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

interface Project {
  slug: string;
  titleEn: string;
  titleRu?: string;
  descriptionEn: string;
  descriptionRu?: string;
  tags: string[];
  techStack: string[];
  status: string;
  liveUrl: string | null;
  githubUrl: string | null;
}

export default function ProjectCard({ project }: { project: Project }) {
  const { language } = useLanguage();
  const title = (language === "ru" && project.titleRu) ? project.titleRu : project.titleEn;
  const description = (language === "ru" && project.descriptionRu) ? project.descriptionRu : project.descriptionEn;

  const href = description
    ? `/projects/${project.slug}`
    : (project.liveUrl || project.githubUrl || "#");
  const isExternal = !description;

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group flex flex-col rounded-xl border border-border bg-background p-5 transition-colors hover:border-accent/50"
    >
      {/* Title */}
      <h3 className="mb-2 text-sm font-medium">{title}</h3>

      {/* Description */}
      {description && (
        <p className="mb-3 text-xs leading-relaxed text-muted line-clamp-3">
          {description}
        </p>
      )}

      {/* Tag badges */}
      <div className="mt-auto flex flex-wrap gap-1 pt-2">
        {project.tags.map((tag) => {
          const colors = tagColors[tag] || { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400" };
          return (
            <span
              key={tag}
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${colors.bg} ${colors.text}`}
            >
              {tag}
            </span>
          );
        })}
        {project.status === "production" && (
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusColors.production}`}>
            production
          </span>
        )}
      </div>
    </Link>
  );
}
