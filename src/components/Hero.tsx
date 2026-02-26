"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      {/* Hero Header */}
      <div className="mb-16 text-center">
        <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
          Full-Stack Developer &{" "}
          <span className="text-accent">Automation Engineer</span>
        </h1>
        <p className="mx-auto mb-8 max-w-3xl text-xl text-muted md:text-2xl">
          Building intelligent automation systems, AI-powered applications,
          and production-ready solutions with Python, TypeScript, and modern
          frameworks.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/projects"
            className="group relative overflow-hidden rounded-full bg-accent px-10 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
          >
            <span className="relative z-10">View Projects</span>
            <div className="absolute inset-0 bg-accent-hover opacity-0 transition-opacity group-hover:opacity-100"></div>
          </Link>
          <Link
            href="/ai-analyst"
            className="rounded-full border-2 border-accent bg-surface px-10 py-4 text-lg font-semibold text-foreground shadow-lg transition-all hover:bg-accent hover:text-white hover:scale-105"
          >
            Try AI Analyst
          </Link>
          <a
            href="https://github.com/CreatmanCEO"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-border bg-surface px-10 py-4 text-lg font-semibold transition-all hover:border-accent hover:shadow-lg hover:scale-105"
          >
            GitHub →
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-16 grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-8">
        <StatCard number="7+" label="Production Projects" color="yellow" />
        <StatCard number="15+" label="Automation Bots" color="green" />
        <StatCard number="100+" label="Hours Saved/Month" color="blue" />
        <StatCard number="1" label="App Store Release" color="yellow" />
      </div>

      {/* Tech Stack */}
      <div className="rounded-3xl border-2 border-border bg-surface p-8 shadow-lg md:p-12">
        <h2 className="mb-8 text-center text-2xl font-bold uppercase tracking-wider text-accent md:text-3xl">
          Tech Stack
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {[
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
          ].map((tech) => (
            <span
              key={tech}
              className="rounded-full border-2 border-border bg-background px-6 py-3 text-base font-semibold shadow-md transition-all hover:border-accent hover:shadow-lg hover:scale-110"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  number,
  label,
  color,
}: {
  number: string;
  label: string;
  color: "yellow" | "green" | "blue";
}) {
  const colorClasses = {
    yellow:
      "from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-800/20 border-yellow-400/50 dark:border-yellow-700/50",
    green:
      "from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 border-green-400/50 dark:border-green-700/50",
    blue: "from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 border-blue-400/50 dark:border-blue-700/50",
  };

  const textColorClasses = {
    yellow: "text-yellow-700 dark:text-yellow-400",
    green: "text-green-700 dark:text-green-400",
    blue: "text-blue-700 dark:text-blue-400",
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-105 ${colorClasses[color]}`}
    >
      <div className={`mb-3 text-5xl font-black ${textColorClasses[color]}`}>
        {number}
      </div>
      <div className="text-sm font-semibold uppercase tracking-wide text-muted">
        {label}
      </div>
    </div>
  );
}
