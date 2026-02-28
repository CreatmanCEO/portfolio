"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function TechStack() {
  const { t } = useLanguage();

  const technologies = [
    "Python",
    "TypeScript",
    "Node.js",
    "React",
    "Next.js",
    "Flutter",
    "n8n",
    "Claude AI",
    "Docker",
    "VPS/DevOps",
  ];

  return (
    <div className="pb-20">
      <h2 className="mb-10 text-sm font-medium uppercase tracking-widest text-muted">
        {t("tech.title")}
      </h2>
      <div className="flex flex-wrap gap-6 text-lg font-medium">
        {technologies.map((tech) => (
          <span
            key={tech}
            className="text-foreground transition-colors hover:text-accent"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
