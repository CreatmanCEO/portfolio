import Link from "next/link";

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
    github: "https://github.com/CreatmanCEO/ACCU",
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
  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">Projects</h1>
        <p className="text-lg text-muted">
          Production-ready applications and automation systems
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
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 transition-all hover:border-accent">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="mb-2 text-xl font-bold">{project.title}</h3>
          <div className="flex gap-2">
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              {project.category}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                project.status === "Production"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : project.status === "Beta"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              }`}
            >
              {project.status}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mb-4 text-sm text-muted">{project.description}</p>

      {/* Tech Stack */}
      <div className="mb-4 flex flex-wrap gap-2">
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
            GitHub →
          </a>
        )}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-accent hover:underline"
          >
            Live Demo →
          </a>
        )}
      </div>
    </div>
  );
}
