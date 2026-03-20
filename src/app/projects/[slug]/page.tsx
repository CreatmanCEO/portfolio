import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

// Tag badge colors (same as ProjectCard)
const tagColors: Record<string, { bg: string; text: string }> = {
  security: { bg: "bg-red-100 dark:bg-red-900/20", text: "text-red-700 dark:text-red-400" },
  ai: { bg: "bg-blue-100 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-400" },
  automation: { bg: "bg-yellow-100 dark:bg-yellow-900/20", text: "text-yellow-700 dark:text-yellow-400" },
  devtools: { bg: "bg-purple-100 dark:bg-purple-900/20", text: "text-purple-700 dark:text-purple-400" },
  infra: { bg: "bg-purple-100 dark:bg-purple-900/20", text: "text-purple-700 dark:text-purple-400" },
  fintech: { bg: "bg-yellow-100 dark:bg-yellow-900/20", text: "text-yellow-700 dark:text-yellow-400" },
  marketplace: { bg: "bg-orange-100 dark:bg-orange-900/20", text: "text-orange-700 dark:text-orange-400" },
  "business-tool": { bg: "bg-orange-100 dark:bg-orange-900/20", text: "text-orange-700 dark:text-orange-400" },
  mobile: { bg: "bg-cyan-100 dark:bg-cyan-900/20", text: "text-cyan-700 dark:text-cyan-400" },
  bot: { bg: "bg-teal-100 dark:bg-teal-900/20", text: "text-teal-700 dark:text-teal-400" },
  opensource: { bg: "bg-green-100 dark:bg-green-900/20", text: "text-green-700 dark:text-green-400" },
};

function getProject(slug: string) {
  const project = db.select().from(projects).where(eq(projects.slug, slug)).get();
  if (!project) return null;
  return {
    ...project,
    tags: JSON.parse(project.tags) as string[],
    techStack: JSON.parse(project.techStack) as string[],
    screenshots: project.screenshots ? JSON.parse(project.screenshots) as string[] : [],
  };
}

export function generateStaticParams() {
  const allProjects = db.select({ slug: projects.slug }).from(projects).all();
  return allProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.seoTitle || project.titleEn} — Creatman`,
    description: project.seoDescription || project.descriptionEn,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      {/* Back link */}
      <Link href="/projects" className="mb-8 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors">
        &larr; Back to Projects
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">{project.titleEn}</h1>

        {/* Tags + Status */}
        <div className="flex flex-wrap items-center gap-2">
          {project.tags.map((tag) => {
            const colors = tagColors[tag] || { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400" };
            return (
              <span key={tag} className={`rounded-full px-3 py-1 text-xs font-medium ${colors.bg} ${colors.text}`}>
                {tag}
              </span>
            );
          })}
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${
            project.status === "production"
              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : project.status === "in_development"
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          }`}>
            {project.status.replace("_", " ")}
          </span>
          <span className="text-xs text-muted">{project.year}</span>
        </div>
      </div>

      {/* Description */}
      {project.descriptionEn && (
        <section className="mb-10">
          <p className="text-base leading-relaxed text-muted">{project.descriptionEn}</p>
        </section>
      )}

      {/* Tech Stack */}
      {project.techStack.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-muted">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span key={tech} className="rounded-lg border border-border px-3 py-1 text-sm">
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Links */}
      <div className="flex flex-wrap gap-4">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/5">
            GitHub &rarr;
          </a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90">
            Live Demo &rarr;
          </a>
        )}
      </div>
    </main>
  );
}
