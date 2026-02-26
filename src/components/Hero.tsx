"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-32">
      {/* Minimalist Hero - Left Aligned */}
      <div className="mb-32">
        <div className="mb-4 text-sm font-medium uppercase tracking-widest text-muted">
          Full-Stack Developer & Automation Engineer
        </div>
        <h1 className="mb-8 text-6xl font-black leading-[1.1] tracking-tight md:text-7xl lg:text-8xl">
          Building the future
          <br />
          with{" "}
          <span className="bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
            intelligent automation
          </span>
        </h1>
        <p className="mb-12 max-w-2xl text-xl leading-relaxed text-muted md:text-2xl">
          Crafting production-ready solutions with Python, TypeScript, and AI.
          Shipped 7+ projects, 15+ automation bots, 100+ hours saved monthly.
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

      {/* Featured Work Preview - Simple Grid */}
      <div className="mb-32">
        <h2 className="mb-12 text-sm font-medium uppercase tracking-widest text-muted">
          Featured Projects
        </h2>
        <div className="grid gap-12 md:grid-cols-2">
          <ProjectCard
            title="AviaWallet"
            description="iOS app for tracking aviation miles and bonuses"
            tag="App Store"
          />
          <ProjectCard
            title="n8n Automation Suite"
            description="15+ production workflows saving 100+ hours monthly"
            tag="Automation"
          />
        </div>
      </div>

      {/* Tech Stack - Minimal List */}
      <div>
        <h2 className="mb-8 text-sm font-medium uppercase tracking-widest text-muted">
          Tech Stack
        </h2>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-lg font-medium">
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
              className="text-foreground transition-colors hover:text-accent"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  title,
  description,
  tag,
}: {
  title: string;
  description: string;
  tag: string;
}) {
  return (
    <div className="group cursor-pointer border-l-4 border-foreground pl-6 transition-all hover:border-accent">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
        {tag}
      </div>
      <h3 className="mb-3 text-2xl font-bold transition-colors group-hover:text-accent">
        {title}
      </h3>
      <p className="text-muted">{description}</p>
    </div>
  );
}
