import Link from "next/link";

interface ProjectCardProps {
  title: string;
  description: string;
  tech: string[];
  link: string;
}

export default function ProjectCard({
  title,
  description,
  tech,
  link,
}: ProjectCardProps) {
  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg border border-border bg-surface p-6 transition-all duration-200 hover:border-accent"
    >
      <h3 className="mb-3 text-2xl font-bold transition-colors group-hover:text-accent">
        {title}
      </h3>
      <p className="mb-4 text-muted">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tech.map((item) => (
          <span
            key={item}
            className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground transition-colors group-hover:border-accent group-hover:text-accent"
          >
            {item}
          </span>
        ))}
      </div>
    </Link>
  );
}
