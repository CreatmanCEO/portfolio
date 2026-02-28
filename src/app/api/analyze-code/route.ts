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
      en: "Please respond in English.",
      es: "Por favor responde en Español.",
      ru: "Пожалуйста, отвечай на Русском языке.",
      he: "אנא השב בעברית.",
      ja: "日本語で返答してください。",
    };

    const languageInstruction = languageInstructions[language] || languageInstructions.en;

    const prompt = `${languageInstruction}

Analyze the following code and provide:
1. What it does (brief summary)
2. Code quality assessment
3. Potential issues or bugs
4. Suggestions for improvement
5. Best practices violations (if any)

Code:
\`\`\`
${code}
\`\`\``;

    console.log("[API /analyze-code] Starting Gemini AI analysis...");

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use stable model name without version suffix
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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
