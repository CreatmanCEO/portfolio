"use client";

import ProjectForm from "@/components/admin/ProjectForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProjectPage() {
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
        <h1 className="text-2xl font-bold">New Project</h1>
      </div>
      <ProjectForm />
    </div>
  );
}
