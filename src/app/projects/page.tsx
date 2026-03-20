import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc, asc } from "drizzle-orm";
import ProjectGrid from "@/components/ProjectGrid";

export const metadata = {
  title: "Projects — Creatman",
  description: "20+ shipped products across security, AI, fintech, infrastructure, and developer tools.",
};

export default function ProjectsPage() {
  const allProjects = db
    .select()
    .from(projects)
    .orderBy(desc(projects.year), asc(projects.sortOrder))
    .all()
    .map((p) => ({
      ...p,
      tags: JSON.parse(p.tags) as string[],
      techStack: JSON.parse(p.techStack) as string[],
      screenshots: p.screenshots ? JSON.parse(p.screenshots) as string[] : [],
    }));

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">Projects</h1>
        <p className="text-muted">
          20+ shipped products across security, AI, fintech, infrastructure, and developer tools.
        </p>
      </div>
      <ProjectGrid projects={allProjects} />
    </main>
  );
}
