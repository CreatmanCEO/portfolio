"use client";

import { useState } from "react";
import ProjectFilter from "./ProjectFilter";
import ProjectCard from "./ProjectCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface Project {
  id: number;
  slug: string;
  titleEn: string;
  titleRu: string;
  descriptionEn: string;
  descriptionRu: string;
  tags: string[];
  techStack: string[];
  status: string;
  year: number;
  githubUrl: string | null;
  liveUrl: string | null;
  coverImage: string | null;
  complexityBadge: string | null;
}

interface ProjectGridProps {
  projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  const [activeTag, setActiveTag] = useState("all");
  const { language } = useLanguage();

  const filtered = activeTag === "all"
    ? projects
    : projects.filter((p) => p.tags.includes(activeTag));

  return (
    <>
      <ProjectFilter activeTag={activeTag} onTagChange={setActiveTag} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => {
          return (
            <ProjectCard key={project.slug} project={project} />
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-center text-muted">No projects found for this tag.</p>
      )}
    </>
  );
}
