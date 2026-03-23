import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pageViews } from "@/db/schema";
import { sql, desc, gte } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7d";

    // Calculate date threshold
    const now = new Date();
    let dateThreshold: Date;
    switch (period) {
      case "1d":
        dateThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "30d":
        dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "all":
        dateThreshold = new Date(0);
        break;
      default: // 7d
        dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const thresholdStr = dateThreshold.toISOString();

    // Total views in period
    const totalViews = db
      .select({ count: sql<number>`count(*)` })
      .from(pageViews)
      .where(gte(pageViews.createdAt, thresholdStr))
      .get();

    // Unique visitors (by session_id)
    const uniqueVisitors = db
      .select({
        count: sql<number>`count(distinct ${pageViews.sessionId})`,
      })
      .from(pageViews)
      .where(gte(pageViews.createdAt, thresholdStr))
      .get();

    // Views by day (for chart)
    const viewsByDay = db
      .select({
        date: sql<string>`date(${pageViews.createdAt})`,
        count: sql<number>`count(*)`,
      })
      .from(pageViews)
      .where(gte(pageViews.createdAt, thresholdStr))
      .groupBy(sql`date(${pageViews.createdAt})`)
      .orderBy(sql`date(${pageViews.createdAt})`)
      .all();

    // Top pages
    const topPages = db
      .select({
        path: pageViews.path,
        count: sql<number>`count(*)`,
      })
      .from(pageViews)
      .where(gte(pageViews.createdAt, thresholdStr))
      .groupBy(pageViews.path)
      .orderBy(desc(sql`count(*)`))
      .limit(10)
      .all();

    // Top referrers
    const topReferrers = db
      .select({
        referrer: pageViews.referrer,
        count: sql<number>`count(*)`,
      })
      .from(pageViews)
      .where(gte(pageViews.createdAt, thresholdStr))
      .groupBy(pageViews.referrer)
      .orderBy(desc(sql`count(*)`))
      .limit(10)
      .all()
      .filter((r) => r.referrer); // Remove null referrers

    // Top countries
    const topCountries = db
      .select({
        country: pageViews.country,
        count: sql<number>`count(*)`,
      })
      .from(pageViews)
      .where(gte(pageViews.createdAt, thresholdStr))
      .groupBy(pageViews.country)
      .orderBy(desc(sql`count(*)`))
      .limit(10)
      .all()
      .filter((c) => c.country);

    // Recent visits (last 50)
    const recentVisits = db
      .select({
        path: pageViews.path,
        referrer: pageViews.referrer,
        country: pageViews.country,
        createdAt: pageViews.createdAt,
      })
      .from(pageViews)
      .orderBy(desc(pageViews.createdAt))
      .limit(50)
      .all();

    return NextResponse.json({
      totalViews: totalViews?.count || 0,
      uniqueVisitors: uniqueVisitors?.count || 0,
      viewsByDay,
      topPages,
      topReferrers,
      topCountries,
      recentVisits,
    });
  } catch (error) {
    console.error("[Admin Analytics] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
