"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const primaryStack = ["Python", "FastAPI", "Docker", "Linux/VPS", "Next.js", "React", "TypeScript"];
const secondaryStack = ["Suricata", "Zeek", "aiogram", "Flutter", "Electron", "n8n", "Claude AI", "Deepgram", "Bash", "Nginx", "SQLite", "GCP"];

export default function TechStack() {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16 md:py-20">
      <h2 className="mb-6 text-xs font-medium uppercase tracking-widest text-muted">
        {t("tech.title")}
      </h2>

      {/* Primary stack — filled chips */}
      <div className="flex flex-wrap gap-2">
        {primaryStack.map((tech) => (
          <span
            key={tech}
            className="rounded-lg bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Secondary stack — outlined chips, animated */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          expanded ? "mt-3 max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-wrap gap-2">
          {secondaryStack.map((tech) => (
            <span
              key={tech}
              className="rounded-lg border border-border px-3 py-1 text-xs text-muted"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 text-sm text-accent transition-colors hover:text-accent/80"
      >
        {expanded ? "Hide full stack \u2191" : "Full stack \u2192"}
      </button>
    </section>
  );
}
