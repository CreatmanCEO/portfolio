import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(request: NextRequest) {
  try {
    const { githubUrl } = await request.json();

    if (!githubUrl) {
      return NextResponse.json(
        { error: "GitHub URL required" },
        { status: 400 }
      );
    }

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

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 503 }
      );
    }

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You generate portfolio project entries. Return ONLY valid JSON, no markdown code blocks.",
          },
          {
            role: "user",
            content: `Based on this GitHub project, generate a portfolio entry.

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
Keep descriptions concise and professional.`,
          },
        ],
        temperature: 0.3,
        max_tokens: 1024,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Admin Projects Generate] Groq error:", response.status, errorText);
      return NextResponse.json(
        { error: "AI generation unavailable, fill manually" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    // Parse JSON from response
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
