"use client";

import Link from "next/link";
import ProjectCard from "./ProjectCard";
import TechStack from "./TechStack";

export default function Hero() {
  const featuredProjects = [
    {
      title: "ACCU",
      description:
        "Automated Claude Code agent updater. Monitors GitHub releases, auto-updates binary, notification system. Self-hosted on VPS.",
      tech: ["Python", "GitHub API", "VPS", "Telegram"],
      link: "https://github.com/CreatmanCEO/ACCU",
    },
    {
      title: "AviaWallet",
      description:
        "iOS app for managing aviation wallet points. Built with Flutter, shipped to App Store. Features offline sync, push notifications, analytics.",
      tech: ["Flutter", "Dart", "Firebase", "App Store"],
      link: "https://apps.apple.com/app/aviawallet",
    },
    {
      title: "GHOST",
      description:
        "AI assistant with invisible overlay for interviews, meetings, and coding. Multi-provider LLM support (Claude, GPT-4, Gemini), real-time voice transcription.",
      tech: ["Electron", "React", "TypeScript", "Python", "Claude", "Deepgram"],
      link: "https://github.com/CreatmanCEO/GHOST",
    },
    {
      title: "Hebrew Translator Bot",
      description:
        "Telegram bot for document translation with OCR support. Handles images, PDFs, text. Translation memory for consistency.",
      tech: ["Python", "Telegram Bot API", "OCR", "Translation API"],
      link: "https://github.com/CreatmanCEO/HebrewTranslator",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 pt-16 pb-24 md:pt-24 md:pb-32">
      {/* Minimalist Hero - Left Aligned */}
      <div className="mb-24 md:mb-32">
        <div className="mb-6 text-sm font-medium uppercase tracking-widest text-muted">
          Full-Stack Developer & Automation Engineer
        </div>
        <h1 className="mb-6 text-4xl font-black leading-[1.1] tracking-tight md:text-5xl">
          Building intelligent automation systems
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-muted md:text-xl">
          7+ projects | App Store | 100+ hours saved
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 bg-foreground px-8 py-4 text-lg font-semibold text-background transition-all hover:gap-3"
          >
            View Projects
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
          <Link
            href="/ai-analyst"
            className="inline-flex items-center gap-2 border-2 border-foreground px-8 py-4 text-lg font-semibold transition-all hover:bg-foreground hover:text-background"
          >
            Try AI Analyst
          </Link>
        </div>
      </div>

      {/* Featured Projects Grid */}
      <div className="mb-16 md:mb-24">
        <h2 className="mb-8 text-sm font-medium uppercase tracking-widest text-muted md:mb-12">
          Featured Projects
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <TechStack />
    </section>
  );
}
