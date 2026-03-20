import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// GET single blog post by id
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, parseInt(id)))
      .get();

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("[Admin Blog] Get error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

// PUT update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const existing = db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, parseInt(id)))
      .get();

    if (!existing) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Set publishedAt when first published
    let publishedAt = existing.publishedAt;
    if (data.published && !existing.publishedAt) {
      publishedAt = new Date().toISOString();
    }

    db.update(blogPosts)
      .set({
        slug: data.slug || existing.slug,
        titleEn: data.titleEn ?? existing.titleEn,
        titleRu: data.titleRu ?? existing.titleRu,
        contentMd: data.contentMd ?? existing.contentMd,
        excerpt: data.excerpt ?? existing.excerpt,
        coverImage:
          data.coverImage !== undefined ? data.coverImage : existing.coverImage,
        published: data.published ?? existing.published,
        publishedAt,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(blogPosts.id, parseInt(id)))
      .run();

    revalidatePath("/blog");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Blog] Update error:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE blog post
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, parseInt(id)))
      .get();

    if (!existing) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    db.delete(blogPosts).where(eq(blogPosts.id, parseInt(id))).run();

    revalidatePath("/blog");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Blog] Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
