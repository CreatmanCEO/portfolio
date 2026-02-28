import { NextRequest } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("path");

    if (!filePath) {
      return new Response("File path is required", { status: 400 });
    }

    // Security: only allow reading files from the portfolio directory
    const allowedPaths = ["src/", "public/", "package.json", "tsconfig.json", "tailwind.config.ts", "next.config.ts", "README.md"];
    const isAllowed = allowedPaths.some(allowed => filePath.startsWith(allowed) || filePath === allowed);

    if (!isAllowed) {
      return new Response("Access denied", { status: 403 });
    }

    const fullPath = join(process.cwd(), filePath);
    const content = await readFile(fullPath, "utf-8");

    return new Response(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error reading file:", error);
    return new Response("File not found", { status: 404 });
  }
}
