import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// GET all projects (for admin list)
export async function GET() {
  try {
    const allProjects = db
      .select()
      .from(projects)
      .orderBy(desc(projects.year), asc(projects.sortOrder))
      .all();
    return NextResponse.json(allProjects);
  } catch (error) {
    console.error("[Admin Projects] List error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Auto-generate slug from title if not provided
    const slug =
      data.slug ||
      data.titleEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    db.insert(projects)
      .values({
        slug,
        titleEn: data.titleEn || "",
        titleRu: data.titleRu || "",
        descriptionEn: data.descriptionEn || "",
        descriptionRu: data.descriptionRu || "",
        tags: JSON.stringify(data.tags || []),
        techStack: JSON.stringify(data.techStack || []),
        status: data.status || "production",
        year: data.year || new Date().getFullYear(),
        githubUrl: data.githubUrl || null,
        liveUrl: data.liveUrl || null,
        coverImage: data.coverImage || null,
        screenshots: data.screenshots
          ? JSON.stringify(data.screenshots)
          : null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        sortOrder: data.sortOrder || 0,
      })
      .run();

    revalidatePath("/projects");
    revalidatePath("/");

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("[Admin Projects] Create error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
