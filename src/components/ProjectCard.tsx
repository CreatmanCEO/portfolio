import Link from "next/link";

const tagColors: Record<string, { bg: string; text: string }> = {
  security: { bg: "bg-red-100 dark:bg-red-900/20", text: "text-red-700 dark:text-red-400" },
  ai: { bg: "bg-blue-100 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-400" },
  automation: { bg: "bg-yellow-100 dark:bg-yellow-900/20", text: "text-yellow-700 dark:text-yellow-400" },
  fintech: { bg: "bg-yellow-100 dark:bg-yellow-900/20", text: "text-yellow-700 dark:text-yellow-400" },
  devtools: { bg: "bg-purple-100 dark:bg-purple-900/20", text: "text-purple-700 dark:text-purple-400" },
  infra: { bg: "bg-purple-100 dark:bg-purple-900/20", text: "text-purple-700 dark:text-purple-400" },
  marketplace: { bg: "bg-orange-100 dark:bg-orange-900/20", text: "text-orange-700 dark:text-orange-400" },
  "business-tool": { bg: "bg-orange-100 dark:bg-orange-900/20", text: "text-orange-700 dark:text-orange-400" },
  mobile: { bg: "bg-cyan-100 dark:bg-cyan-900/20", text: "text-cyan-700 dark:text-cyan-400" },
  bot: { bg: "bg-teal-100 dark:bg-teal-900/20", text: "text-teal-700 dark:text-teal-400" },
  opensource: { bg: "bg-green-100 dark:bg-green-900/20", text: "text-green-700 dark:text-green-400" },
};

const statusColors: Record<string, string> = {
  production: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  in_development: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  concept: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

interface Project {
  slug: string;
  titleEn: string;
  descriptionEn: string;
  tags: string[];
  techStack: string[];
  status: string;
  liveUrl: string | null;
  githubUrl: string | null;
}

export default function ProjectCard({ project }: { project: Project }) {
  const href = project.descriptionEn
    ? `/projects/${project.slug}`
    : (project.liveUrl || project.githubUrl || "#");
  const isExternal = !project.descriptionEn;

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group flex flex-col rounded-xl border border-border bg-background p-5 transition-colors hover:border-accent/50"
    >
      {/* Title */}
      <h3 className="mb-2 text-sm font-medium">{project.titleEn}</h3>

      {/* Description */}
      {project.descriptionEn && (
        <p className="mb-3 text-xs leading-relaxed text-muted line-clamp-3">
          {project.descriptionEn}
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
