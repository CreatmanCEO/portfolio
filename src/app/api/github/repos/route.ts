import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("[API /github/repos] Fetching repositories");

    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Creatman-Portfolio',
    };

    // Add GitHub token if available (for higher rate limits)
    const githubToken = process.env.GITHUB_TOKEN;
    if (githubToken) {
      headers['Authorization'] = `Bearer ${githubToken}`;
      console.log("[API /github/repos] Using authenticated request");
    } else {
      console.log("[API /github/repos] Using unauthenticated request (lower rate limit)");
    }

    const response = await fetch(
      "https://api.github.com/users/CreatmanCEO/repos?sort=updated&per_page=20",
      { headers }
    );

    console.log("[API /github/repos] Response status:", response.status);
    console.log("[API /github/repos] Rate limit remaining:", response.headers.get('x-ratelimit-remaining'));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[API /github/repos] GitHub API error:", errorText);
      return new Response(errorText, { status: response.status });
    }

    const data = await response.json();
    console.log("[API /github/repos] Successfully fetched", data.length, "repositories");

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error("[API /github/repos] Error:", error);
    return new Response("Failed to fetch repositories", { status: 500 });
  }
}
