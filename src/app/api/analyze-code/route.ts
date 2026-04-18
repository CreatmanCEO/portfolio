import { NextRequest } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(request: NextRequest) {
  try {
    const { code, language = "en" } = await request.json();

    if (!code || typeof code !== "string") {
      return new Response("Invalid code input", { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response("AI service not configured.", { status: 503 });
    }

    const languageInstructions: { [key: string]: string } = {
      en: "Respond ONLY in English. Do not mix languages.",
      ru: "Отвечай ТОЛЬКО на русском языке. Не смешивай языки. Пиши грамотно, завершай все предложения.",
    };

    const languageInstruction = languageInstructions[language] || languageInstructions.en;
    const currentDate = new Date().toISOString().split("T")[0];

    const systemPrompt = `You are a professional code reviewer. ${languageInstruction}
Current date: ${currentDate}. All technologies mentioned are current as of 2026.

IMPORTANT RULES:
- Complete every sentence. Never leave text unfinished.
- Do not hallucinate or invent information not present in the code.
- Only analyze what you see in the code below.
- Be concise and factual.`;

    const userPrompt = `Analyze the following code:

1. Brief summary (what it does)
2. Code quality (1-10 score with reasoning)
3. Potential bugs or issues
4. Improvement suggestions
5. Best practices check

\`\`\`
${code}
\`\`\``;

    const requestBody = JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 4096,
      stream: true,
    });

    const requestHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };

    // Try with retry on 429
    let response: Response | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: requestHeaders,
        body: requestBody,
      });

      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get("retry-after") || "2");
        console.log(`[API /analyze-code] Rate limited, retrying in ${retryAfter}s (attempt ${attempt + 1}/3)`);
        await new Promise((r) => setTimeout(r, retryAfter * 1000));
        continue;
      }
      break;
    }

    if (!response || !response.ok) {
      const status = response?.status || 500;
      console.error("[API /analyze-code] Groq error:", status);
      return new Response("AI service temporarily unavailable. Please try again in a moment.", { status: 503 });
    }

    // Stream SSE response from Groq
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const reader = response.body!.getReader();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          let buffer = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch {
                // Skip malformed chunks
              }
            }
          }
          controller.close();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          controller.enqueue(encoder.encode(`Error: ${errorMessage}`));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("[API /analyze-code] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(`Analysis failed: ${errorMessage}`, { status: 500 });
  }
}
