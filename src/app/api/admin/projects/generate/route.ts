import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const { githubUrl } = await request.json();

    if (!githubUrl) {
      return NextResponse.json(
        { error: "GitHub URL required" },
        { status: 400 }
      );
    }

    // Extract owner/repo from URL
    const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      return NextResponse.json(
        { error: "Invalid GitHub URL" },
        { status: 400 }
      );
    }

    const [, owner, repo] = match;

    // Fetch README from main or master branch
    let readmeContent = "";
    for (const branch of ["main", "master"]) {
      if (readmeContent) break;
      try {
        const readmeRes = await fetch(
          `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`,
          { signal: AbortSignal.timeout(10000) }
        );
        if (readmeRes.ok) {
          readmeContent = await readmeRes.text();
        }
      } catch {
        // Try next branch
      }
    }

    // Fetch repo info from GitHub API
    let repoDescription = "";
    try {
      const headers: Record<string, string> = {};
      if (process.env.GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
      }
      const repoRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}`,
        { signal: AbortSignal.timeout(10000), headers }
      );
      if (repoRes.ok) {
        const repoData = await repoRes.json();
        repoDescription = repoData.description || "";
      }
    } catch {
      // Ignore
    }

    if (!readmeContent && !repoDescription) {
      return NextResponse.json(
        { error: "Could not fetch project info from GitHub" },
        { status: 404 }
      );
    }

    // Generate with Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 503 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Based on this GitHub project, generate a portfolio entry. Return ONLY valid JSON, no markdown.

Repository: ${owner}/${repo}
Description: ${repoDescription}
README content (first 3000 chars): ${readmeContent.slice(0, 3000)}

Return JSON with these exact fields:
{
  "titleEn": "project title in English",
  "descriptionEn": "2-3 sentence project description for a portfolio, in English",
  "tags": ["array", "of", "relevant", "tags"],
  "techStack": ["array", "of", "technologies"],
  "status": "production or in_development or concept"
}

Valid tags: security, ai, automation, devtools, fintech, infra, marketplace, business-tool, mobile, bot, opensource
Keep descriptions concise and professional.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Parse JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "AI returned invalid format" },
        { status: 500 }
      );
    }

    const generated = JSON.parse(jsonMatch[0]);

    return NextResponse.json(generated);
  } catch (error) {
    console.error("[Admin Projects Generate] Error:", error);
    return NextResponse.json(
      { error: "AI generation unavailable, fill manually" },
      { status: 500 }
    );
  }
}
