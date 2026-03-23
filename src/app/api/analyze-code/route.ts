import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    console.log("[API /analyze-code] Received request");
    const { code, language = "en" } = await request.json();

    console.log("[API /analyze-code] Request params:", {
      codeLength: code?.length,
      language,
    });

    if (!code || typeof code !== "string") {
      console.error("[API /analyze-code] Invalid code input");
      return new Response("Invalid code input", { status: 400 });
    }

    // Check for API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[API /analyze-code] GEMINI_API_KEY not configured");
      return new Response("AI service not configured. Please set GEMINI_API_KEY.", { status: 503 });
    }

    const languageInstructions: { [key: string]: string } = {
      en: "Respond ONLY in English. Do not mix languages.",
      ru: "Отвечай ТОЛЬКО на русском языке. Не смешивай языки. Пиши грамотно, завершай все предложения.",
    };

    const languageInstruction = languageInstructions[language] || languageInstructions.en;

    const currentDate = new Date().toISOString().split('T')[0];

    const prompt = `You are a professional code reviewer. ${languageInstruction}

Current date: ${currentDate}. All technologies mentioned are current as of 2026.

IMPORTANT RULES:
- Complete every sentence. Never leave text unfinished.
- Do not hallucinate or invent information not present in the code.
- Only analyze what you see in the code below.
- Be concise and factual.

Analyze the following code:

1. Brief summary (what it does)
2. Code quality (1-10 score with reasoning)
3. Potential bugs or issues
4. Improvement suggestions
5. Best practices check

\`\`\`
${code}
\`\`\``;

    console.log("[API /analyze-code] Starting Gemini AI analysis...");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        maxOutputTokens: 4096,
      },
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          console.log("[API /analyze-code] Sending prompt to Gemini");
          const result = await model.generateContentStream(prompt);

          let chunkCount = 0;
          for await (const chunk of result.stream) {
            chunkCount++;
            const chunkText = chunk.text();
            console.log("[API /analyze-code] Received chunk", chunkCount, "- length:", chunkText.length);
            controller.enqueue(encoder.encode(chunkText));
          }

          console.log("[API /analyze-code] Gemini stream complete. Total chunks:", chunkCount);
          controller.close();
        } catch (error) {
          console.error("[API /analyze-code] Gemini stream error:", error);
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
