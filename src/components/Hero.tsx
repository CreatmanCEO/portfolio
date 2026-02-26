"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:py-32">
      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        {/* Left Column - Text */}
        <div className="flex flex-col justify-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Full-Stack Developer &{" "}
            <span className="text-accent">Automation Engineer</span>
          </h1>
          <p className="mb-8 text-lg text-muted md:text-xl">
            Building intelligent automation systems, AI-powered applications,
            and production-ready solutions with Python, TypeScript, and modern
            frameworks.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/projects"
              className="rounded-full bg-accent px-8 py-3 font-medium text-white transition-colors hover:bg-accent-hover"
            >
              View Projects
            </Link>
            <Link
              href="/ai-analyst"
              className="rounded-full border border-border bg-surface px-8 py-3 font-medium transition-colors hover:bg-accent/10"
            >
              Try AI Analyst
            </Link>
            <a
              href="https://github.com/CreatmanCEO"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border bg-surface px-8 py-3 font-medium transition-colors hover:bg-accent/10"
            >
              GitHub
            </a>
          </div>
        </div>

        {/* Right Column - Stats */}
        <div className="grid grid-cols-2 gap-6">
          <StatCard number="7+" label="Production Projects" />
          <StatCard number="15+" label="Automation Bots" />
          <StatCard number="100+" label="Hours Saved/Month" />
          <StatCard number="1" label="App Store Release" />
        </div>
      </div>

      {/* Tech Stack */}
      <div className="mt-16 border-t border-border pt-12">
        <p className="mb-6 text-sm font-medium uppercase tracking-wider text-muted">
          Tech Stack
        </p>
        <div className="flex flex-wrap gap-3">
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
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="mb-2 text-3xl font-bold text-accent">{number}</div>
      <div className="text-sm text-muted">{label}</div>
    </div>
  );
}
