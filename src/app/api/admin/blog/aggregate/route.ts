import { NextResponse } from "next/server";
import { aggregateExternalPosts } from "@/lib/blog-aggregator";
import { revalidatePath } from "next/cache";

// POST trigger blog aggregation from Dev.to / Hashnode
export async function POST() {
  try {
    const counts = await aggregateExternalPosts();

    revalidatePath("/blog");

    return NextResponse.json({
      success: true,
      imported: counts,
      message: `Imported ${counts.devto} from Dev.to, ${counts.hashnode} from Hashnode`,
    });
  } catch (error) {
    console.error("[Admin Blog] Aggregation error:", error);
    return NextResponse.json(
      { error: "Aggregation failed" },
      { status: 500 }
    );
  }
}
