import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pageViews } from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, referrer, sessionId } = body;

    if (!path || typeof path !== "string") {
      return new NextResponse(null, { status: 400 });
    }

    // Extract country from headers (Cloudflare or similar)
    const country =
      request.headers.get("cf-ipcountry") ||
      request.headers.get("x-vercel-ip-country") ||
      null;

    const userAgent = request.headers.get("user-agent") || null;

    db.insert(pageViews)
      .values({
        path: path.slice(0, 500),
        referrer: referrer ? String(referrer).slice(0, 1000) : null,
        country,
        userAgent: userAgent ? userAgent.slice(0, 500) : null,
        sessionId: sessionId ? String(sessionId).slice(0, 100) : null,
      })
      .run();

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[Track] Error:", error);
    return new NextResponse(null, { status: 500 });
  }
}
