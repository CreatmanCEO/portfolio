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
          // Aggregator card (full width)
          if (project.slug === "telegram-bots-aggregator") {
            return (
              <div
                key={project.slug}
                className="col-span-full rounded-xl bg-surface border border-border p-6"
              >
                <h3 className="mb-2 text-sm font-medium">{(language === "ru" && project.titleRu) ? project.titleRu : project.titleEn}</h3>
                <p className="text-xs text-muted leading-relaxed">{(language === "ru" && project.descriptionRu) ? project.descriptionRu : project.descriptionEn}</p>
                <a
                  href="https://github.com/CreatmanCEO?tab=repositories"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-xs text-accent"
                >
                  See all on GitHub &rarr;
                </a>
              </div>
            );
          }

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
