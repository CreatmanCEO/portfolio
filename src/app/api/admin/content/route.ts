import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { siteContent } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// GET all site_content
export async function GET() {
  try {
    const rows = db.select().from(siteContent).all();
    const content: Record<string, string> = {};
    for (const row of rows) {
      content[row.key] = row.value;
    }
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

// PUT update a site_content key
export async function PUT(request: NextRequest) {
  try {
    const { key, value } = await request.json();

    if (!key || typeof value !== "string") {
      return NextResponse.json({ error: "Invalid key or value" }, { status: 400 });
    }

    const existing = db.select().from(siteContent).where(eq(siteContent.key, key)).get();

    if (existing) {
      db.update(siteContent)
        .set({ value, updatedAt: new Date().toISOString() })
        .where(eq(siteContent.key, key))
        .run();
    } else {
      db.insert(siteContent)
        .values({ key, value })
        .run();
    }

    // Revalidate pages that use this content
    revalidatePath("/");
    revalidatePath("/projects");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
