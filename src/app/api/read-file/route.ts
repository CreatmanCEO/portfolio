import { NextRequest } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(request: NextRequest) {
  try {
    console.log("[API /read-file] Received request");
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("path");

    console.log("[API /read-file] Requested path:", filePath);

    if (!filePath) {
      console.error("[API /read-file] No file path provided");
      return new Response("File path is required", { status: 400 });
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
