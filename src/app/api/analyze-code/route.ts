import { NextRequest } from "next/server";
import { spawn } from "child_process";

export async function POST(request: NextRequest) {
  try {
    const { code, language = "en" } = await request.json();

    if (!code || typeof code !== "string") {
      return new Response("Invalid code input", { status: 400 });
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

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          // Spawn claude process
          const claude = spawn("claude", ["--print"], {
            stdio: ["pipe", "pipe", "pipe"],
          });

          // Send prompt to claude's stdin
          claude.stdin.write(prompt);
          claude.stdin.end();

          // Stream stdout to client
          claude.stdout.on("data", (chunk) => {
            controller.enqueue(encoder.encode(chunk.toString()));
          });

          // Handle errors
          claude.stderr.on("data", (data) => {
            console.error("Claude stderr:", data.toString());
          });

          // Close stream when claude exits
          claude.on("close", (code) => {
            if (code !== 0) {
              console.error(`Claude exited with code ${code}`);
            }
            controller.close();
          });

          // Handle process errors
          claude.on("error", (error) => {
            console.error("Claude process error:", error);
            controller.error(error);
          });
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
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
    console.error("Analysis error:", error);
    return new Response("Analysis failed", { status: 500 });
  }
}
