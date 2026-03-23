import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// GET all blog posts (for admin list)
export async function GET() {
  try {
    const allPosts = db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.publishedAt))
      .all();
    return NextResponse.json(allPosts);
  } catch (error) {
    console.error("[Admin Blog] List error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// POST create original blog post
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const slug =
      data.slug ||
      data.titleEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    db.insert(blogPosts)
      .values({
        slug,
        titleEn: data.titleEn || "",
        titleRu: data.titleRu || "",
        contentMd: data.contentMd || "",
        excerpt: data.excerpt || "",
        coverImage: data.coverImage || null,
        source: "original",
        externalUrl: null,
        externalId: null,
        published: data.published ?? false,
        publishedAt: data.published ? new Date().toISOString() : null,
      })
      .run();

    revalidatePath("/blog");

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("[Admin Blog] Create error:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
