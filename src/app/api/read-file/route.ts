import { NextRequest } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(request: NextRequest) {
  try {
    console.log("[API /read-file] Received request");
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("path");
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");
    const branch = searchParams.get("branch") || "main";

    console.log("[API /read-file] Requested:", { filePath, owner, repo, branch });

    if (!filePath) {
      console.error("[API /read-file] No file path provided");
      return new Response("File path is required", { status: 400 });
    }

    // If owner and repo are provided, fetch from GitHub
    if (owner && repo) {
      console.log("[API /read-file] Fetching from GitHub");

      const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3.raw',
        'User-Agent': 'Creatman-Portfolio',
      };

      const githubToken = process.env.GITHUB_TOKEN;
      if (githubToken) {
        headers['Authorization'] = `Bearer ${githubToken}`;
      }

      const githubUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
      console.log("[API /read-file] GitHub URL:", githubUrl);

      const response = await fetch(githubUrl, { headers });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[API /read-file] GitHub API error:", errorText);
        return new Response(`GitHub error: ${response.status}`, { status: response.status });
      }

      const content = await response.text();
      console.log("[API /read-file] Fetched from GitHub, length:", content.length);

      return new Response(content, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, s-maxage=300",
        },
      });
    }

    // Security: only allow reading files from the portfolio directory
    const allowedPaths = ["src/", "public/", "package.json", "tsconfig.json", "tailwind.config.ts", "next.config.ts", "README.md"];
    const isAllowed = allowedPaths.some(allowed => filePath.startsWith(allowed) || filePath === allowed);

    console.log("[API /read-file] Path allowed:", isAllowed);

    if (!isAllowed) {
      console.error("[API /read-file] Access denied for path:", filePath);
      return new Response("Access denied", { status: 403 });
    }

    const fullPath = join(process.cwd(), filePath);
    console.log("[API /read-file] Full path:", fullPath);

    const content = await readFile(fullPath, "utf-8");
    console.log("[API /read-file] File read successfully, length:", content.length);

    return new Response(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("[API /read-file] Error reading file:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(`File not found: ${errorMessage}`, { status: 404 });
  }
}
