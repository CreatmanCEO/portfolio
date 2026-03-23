import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// GET single project by id
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = db
      .select()
      .from(projects)
      .where(eq(projects.id, parseInt(id)))
      .get();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("[Admin Projects] Get error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// PUT update project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const existing = db
      .select()
      .from(projects)
      .where(eq(projects.id, parseInt(id)))
      .get();

    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    db.update(projects)
      .set({
        slug: data.slug || existing.slug,
        titleEn: data.titleEn ?? existing.titleEn,
        titleRu: data.titleRu ?? existing.titleRu,
        descriptionEn: data.descriptionEn ?? existing.descriptionEn,
        descriptionRu: data.descriptionRu ?? existing.descriptionRu,
        tags: data.tags ? JSON.stringify(data.tags) : existing.tags,
        techStack: data.techStack
          ? JSON.stringify(data.techStack)
          : existing.techStack,
        status: data.status || existing.status,
        year: data.year ?? existing.year,
        githubUrl: data.githubUrl !== undefined ? data.githubUrl : existing.githubUrl,
        liveUrl: data.liveUrl !== undefined ? data.liveUrl : existing.liveUrl,
        coverImage:
          data.coverImage !== undefined ? data.coverImage : existing.coverImage,
        screenshots: data.screenshots
          ? JSON.stringify(data.screenshots)
          : existing.screenshots,
        problem: data.problem !== undefined ? data.problem : existing.problem,
        solution: data.solution !== undefined ? data.solution : existing.solution,
        results: data.results !== undefined ? data.results : existing.results,
        complexityBadge: data.complexityBadge !== undefined ? (data.complexityBadge || null) : existing.complexityBadge,
        seoTitle:
          data.seoTitle !== undefined ? data.seoTitle : existing.seoTitle,
        seoDescription:
          data.seoDescription !== undefined
            ? data.seoDescription
            : existing.seoDescription,
        sortOrder: data.sortOrder ?? existing.sortOrder,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(projects.id, parseInt(id)))
      .run();

    revalidatePath("/projects");
    revalidatePath("/");
    revalidatePath(`/projects/${data.slug || existing.slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Projects] Update error:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE project
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = db
      .select()
      .from(projects)
      .where(eq(projects.id, parseInt(id)))
      .get();

    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    db.delete(projects).where(eq(projects.id, parseInt(id))).run();

    revalidatePath("/projects");
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Projects] Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
