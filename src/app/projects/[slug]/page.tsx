import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import TranslatedText from "@/components/TranslatedText";
import type { Metadata } from "next";

// Tag badge colors (same as ProjectCard)
const tagColors: Record<string, { bg: string; text: string }> = {
  security: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-800 dark:text-red-300" },
  ai: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-800 dark:text-blue-300" },
  automation: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-800 dark:text-amber-300" },
  devtools: { bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-800 dark:text-violet-300" },
  infra: { bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-800 dark:text-violet-300" },
  fintech: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-800 dark:text-amber-300" },
  marketplace: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-800 dark:text-orange-300" },
  "business-tool": { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-800 dark:text-orange-300" },
  mobile: { bg: "bg-sky-100 dark:bg-sky-900/30", text: "text-sky-800 dark:text-sky-300" },
  bot: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-800 dark:text-emerald-300" },
  opensource: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-800 dark:text-green-300" },
};

function getProject(slug: string) {
  try {
    const project = db.select().from(projects).where(eq(projects.slug, slug)).get();
    if (!project) return null;
    return {
      ...project,
      tags: JSON.parse(project.tags) as string[],
      techStack: JSON.parse(project.techStack) as string[],
      screenshots: project.screenshots ? JSON.parse(project.screenshots) as string[] : [],
      parsedResults: project.results ? (() => { try { return JSON.parse(project.results) as string[]; } catch { return []; } })() : [],
    };
  } catch {
    return null; // DB schema mismatch during build
  }
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const project = getProject(slug);
    if (!project) return { title: "Project Not Found" };

    return {
      title: `${project.seoTitle || project.titleEn} — Creatman`,
      description: project.seoDescription || project.descriptionEn,
    };
  } catch {
    return { title: "Projects — Creatman" };
  }
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
        <TranslatedText tKey="projects.backToProjects" />
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

      {/* Problem */}
      {project.problem && (
        <section className="mb-8">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted">Problem</h2>
          <p className="text-sm leading-relaxed text-muted md:text-base">{project.problem}</p>
        </section>
      )}

      {/* Solution */}
      {project.solution && (
        <section className="mb-8">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted">Solution</h2>
          <p className="text-sm leading-relaxed text-muted md:text-base">{project.solution}</p>
        </section>
      )}

      {/* Results */}
      {project.parsedResults && project.parsedResults.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted">Results & Impact</h2>
          <ul className="space-y-2">
            {project.parsedResults.map((result: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted md:text-base">
                <span className="mt-1 text-accent">{'\u2713'}</span>
                <span>{result}</span>
              </li>
            ))}
          </ul>
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
