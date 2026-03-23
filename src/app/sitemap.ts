import { db } from "@/db";
import { projects, blogPosts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://creatman.site";

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 1 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/ai-analyst`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  // Dynamic project pages
  const allProjects = db
    .select({ slug: projects.slug, updatedAt: projects.updatedAt })
    .from(projects)
    .all();
  const projectPages = allProjects.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Dynamic blog pages (original only)
  const originalPosts = db
    .select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt })
    .from(blogPosts)
    .where(and(eq(blogPosts.source, "original"), eq(blogPosts.published, true)))
    .all();
  const blogPages = originalPosts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...projectPages, ...blogPages];
}
