import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc, asc } from "drizzle-orm";
import ProjectGrid from "@/components/ProjectGrid";
import TranslatedText from "@/components/TranslatedText";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Projects — Creatman",
  description: "20+ shipped products across security, AI, fintech, infrastructure, and developer tools.",
};

function queryProjects() {
  return db
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
}

export default function ProjectsPage() {
  let allProjects: ReturnType<typeof queryProjects> = [];
  try {
    allProjects = queryProjects();
  } catch {
    // DB not available during build
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl"><TranslatedText tKey="projects.page.title" /></h1>
        <p className="text-muted">
          <TranslatedText tKey="projects.page.subtitle" />
        </p>
      </div>
      <ProjectGrid projects={allProjects} />
    </main>
  );
}
