"use client";

import { useEffect, useState, use } from "react";
import ProjectForm from "@/components/admin/ProjectForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ProjectRaw {
  id: number;
  slug: string;
  titleEn: string;
  titleRu: string;
  descriptionEn: string;
  descriptionRu: string;
  tags: string;
  techStack: string;
  status: string;
  year: number;
  githubUrl: string | null;
  liveUrl: string | null;
  sortOrder: number;
}

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [project, setProject] = useState<ProjectRaw | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/admin/projects/${id}`);
        if (!res.ok) throw new Error("Not found");
        setProject(await res.json());
      } catch {
        setError("Project not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted">
        Loading...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="py-20 text-center text-red-600">
        {error || "Project not found"}
      </div>
    );
  }

  // Parse JSON fields for the form
  const parseTags = (json: string): string[] => {
    try {
      return JSON.parse(json);
    } catch {
      return [];
    }
  };

  const initialData = {
    id: project.id,
    titleEn: project.titleEn,
    titleRu: project.titleRu,
    slug: project.slug,
    descriptionEn: project.descriptionEn,
    descriptionRu: project.descriptionRu,
    tags: parseTags(project.tags),
    techStack: parseTags(project.techStack),
    status: project.status,
    year: project.year,
    githubUrl: project.githubUrl || "",
    liveUrl: project.liveUrl || "",
    sortOrder: project.sortOrder,
    complexityBadge: (project as ProjectRaw & { complexityBadge?: string | null }).complexityBadge || "",
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/creatsetup/projects"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
        <h1 className="text-2xl font-bold">Edit Project</h1>
      </div>
      <ProjectForm initialData={initialData} isEdit />
    </div>
  );
}
