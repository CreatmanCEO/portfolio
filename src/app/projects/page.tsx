"use client";

import { useLanguage } from "@/contexts/LanguageContext";

const projects = [
  {
    title: "GHOST",
    description:
      "AI assistant with invisible overlay for interviews, meetings, and coding. Multi-provider LLM support (Claude, GPT-4, Gemini), real-time voice transcription.",
    tech: ["Electron", "React", "TypeScript", "Python", "Claude", "Deepgram"],
    github: "https://github.com/CreatmanCEO/ghost-showcase",
    status: "In Development",
    category: "AI",
  },
  {
    title: "AviaWallet",
    description:
      "Mobile app for managing aviation wallet points. Built with Flutter, shipped to App Store. Features offline sync, push notifications, analytics.",
    tech: ["Flutter", "Dart", "Firebase", "App Store"],
    status: "Production",
    category: "Mobile",
  },
  {
    title: "ACCU",
    description:
      "Automated Claude Code agent updater. Monitors GitHub releases, auto-updates binary, notification system. Self-hosted on VPS.",
    tech: ["Python", "GitHub API", "VPS", "Telegram"],
    github: "https://github.com/CreatmanCEO/accu",
    status: "Production",
    category: "DevOps",
  },
  {
    title: "Club-sbor.ru",
    description:
      "Full-stack marketplace platform built with Bubble.io. Complex algorithmic backend, payment integration, user management. Co-author project.",
    tech: ["Bubble.io", "No-Code", "API", "Payments"],
    link: "https://club-sbor.ru",
    status: "Production",
    category: "Web",
  },
  {
    title: "Cian Parser",
    description:
      "Real estate data scraper with advanced filtering. Exports to Excel, scheduled parsing, duplicate detection. Headless browser automation.",
    tech: ["Python", "Selenium", "Pandas", "Excel"],
    github: "https://github.com/CreatmanCEO/cian-parser-showcase",
    status: "Production",
    category: "Automation",
  },
  {
    title: "Smart Link Collector",
    description:
      "Browser extension for organizing links with AI-powered categorization. Sync across devices, export to Notion.",
    tech: ["TypeScript", "Chrome API", "Claude", "Notion API"],
    github: "https://github.com/CreatmanCEO/smart-link-collector",
    status: "Beta",
    category: "Extension",
  },
  {
    title: "Hebrew Translator Bot",
    description:
      "Telegram bot for document translation with OCR support. Handles images, PDFs, text. Translation memory for consistency.",
    tech: ["Python", "Telegram Bot API", "OCR", "Translation API"],
    github: "https://github.com/CreatmanCEO/hebrew_doc_translator",
    status: "Production",
    category: "Automation",
  },
];

export default function ProjectsPage() {
  const { t } = useLanguage();

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">{t("projects.page.title")}</h1>
        <p className="text-lg text-muted">
          {t("projects.page.subtitle")}
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </main>
  );
}

function ProjectCard({
  project,
}: {
  project: (typeof projects)[0];
}) {
  const { t } = useLanguage();

  const getCategoryKey = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      "AI": "projects.category.ai",
      "Mobile": "projects.category.mobile",
      "DevOps": "projects.category.devops",
      "Web": "projects.category.web",
      "Automation": "projects.category.automation",
      "Extension": "projects.category.extension",
    };
    return categoryMap[category] || category;
  };

  const getStatusKey = (status: string) => {
    const statusMap: { [key: string]: string } = {
      "Production": "projects.status.production",
      "Beta": "projects.status.beta",
      "In Development": "projects.status.inDevelopment",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-8 transition-all hover:border-accent">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="mb-3 text-xl font-bold">{project.title}</h3>
          <div className="flex gap-2">
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              {t(getCategoryKey(project.category))}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                project.status === "Production"
                  ? "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-400"
                  : project.status === "Beta"
                    ? "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-400"
                    : "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-400"
              }`}
            >
              {t(getStatusKey(project.status))}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mb-6 text-sm text-muted leading-relaxed">{project.description}</p>

      {/* Tech Stack */}
      <div className="mb-6 flex flex-wrap gap-2">
        {project.tech.map((tech, i) => (
          <span
            key={i}
            className="rounded-full border border-border bg-background px-3 py-1 text-xs"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex gap-3">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-accent hover:underline"
          >
            {t("projects.link.github")} →
          </a>
        )}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-accent hover:underline"
          >
            {t("projects.link.demo")} →
          </a>
        )}
      </div>
    </div>
  );
}
