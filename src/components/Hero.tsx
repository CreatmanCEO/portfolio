"use client";

import Link from "next/link";
import ProjectCard from "./ProjectCard";
import TechStack from "./TechStack";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  const featuredProjects = [
    {
      title: t("projects.accu.title"),
      description: t("projects.accu.description"),
      tech: ["Python", "GitHub API", "VPS", "Telegram"],
      link: "https://github.com/CreatmanCEO/accu",
    },
    {
      title: t("projects.aviawallet.title"),
      description: t("projects.aviawallet.description"),
      tech: ["Flutter", "Dart", "Firebase", "App Store"],
      link: "https://github.com/CreatmanCEO/crypto-wallet-mvp",
    },
    {
      title: t("projects.ghost.title"),
      description: t("projects.ghost.description"),
      tech: ["Electron", "React", "TypeScript", "Python", "Claude", "Deepgram"],
      link: "https://github.com/CreatmanCEO/ghost-showcase",
    },
    {
      title: t("projects.translator.title"),
      description: t("projects.translator.description"),
      tech: ["Python", "Telegram Bot API", "OCR", "Translation API"],
      link: "https://github.com/CreatmanCEO/hebrew_doc_translator",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 pt-16 pb-24 md:pt-24 md:pb-32">
      {/* Minimalist Hero - Left Aligned */}
      <div className="mb-32 md:mb-40">
        <div className="mb-10 text-sm font-medium uppercase tracking-widest text-muted">
          {t("hero.label")}
        </div>
        <h1 className="mb-10 text-4xl font-black leading-[1.1] tracking-tight md:text-5xl">
          {t("hero.headline")}
        </h1>
        <p className="mb-12 text-lg leading-relaxed text-muted md:text-xl">
          {t("hero.description")}
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 bg-foreground px-8 py-4 text-lg font-semibold text-background transition-all hover:gap-3"
          >
            {t("hero.viewProjects")}
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
          <Link
            href="/ai-analyst"
            className="inline-flex items-center gap-2 border-2 border-foreground px-8 py-4 text-lg font-semibold transition-all hover:bg-foreground hover:text-background"
          >
            {t("hero.tryAI")}
          </Link>
        </div>
      </div>

      {/* Featured Projects Grid */}
      <div className="mb-24 md:mb-32">
        <h2 className="mb-8 text-sm font-medium uppercase tracking-widest text-muted md:mb-12">
          {t("hero.featuredProjects")}
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
