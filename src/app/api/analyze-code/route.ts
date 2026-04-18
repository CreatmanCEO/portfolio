import { NextRequest } from "next/server";
import crypto from "crypto";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// In-memory cache check via SQLite
function getCached(hash: string): string | null {
  try {
    const { db } = require("@/db");
    const { analysisCache } = require("@/db/schema");
    const { eq } = require("drizzle-orm");
    const row = db.select().from(analysisCache).where(eq(analysisCache.codeHash, hash)).get();
    return row?.result || null;
  } catch {
    return null;
  }
}

function setCache(hash: string, result: string, mode: string, language: string): void {
  try {
    const { db } = require("@/db");
    const { analysisCache } = require("@/db/schema");
    db.insert(analysisCache).values({ codeHash: hash, result, mode, language }).run();
  } catch {
    // Cache write failure is non-critical
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code, language = "en", mode = "file" } = await request.json();

    if (!code || typeof code !== "string") {
      return new Response("Invalid code input", { status: 400 });
    }

    // Check cache first
    const codeHash = crypto.createHash("sha256").update(`${mode}:${language}:${code}`).digest("hex");
    const cached = getCached(codeHash);
    if (cached) {
      return new Response(cached, {
        headers: { "Content-Type": "text/plain; charset=utf-8", "X-Cache": "HIT" },
      });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response("AI service not configured.", { status: 503 });
    }

    const currentDate = new Date().toISOString().split("T")[0];

    // Different prompts for repo overview vs file analysis
    const systemPrompts: Record<string, Record<string, string>> = {
      repo: {
        en: `You are a senior engineering consultant reviewing a developer's portfolio project. Current date: ${currentDate}.

Your audience is a technical recruiter, engineering manager, or CTO evaluating this developer's capabilities.

Write a narrative assessment (NOT a numbered list). Structure as flowing paragraphs:

**Opening paragraph**: What this project does and what problem it solves. Show you understand the domain.

**Architecture & Engineering**: Evaluate the technical decisions — stack choices, project structure, separation of concerns. Note what's done well and what's unconventional but justified.

**Production Readiness**: Assess whether this code could run in production. Look for: error handling, security considerations, deployment setup, documentation quality.

**Honest Assessment**: Be specific about strengths AND areas for improvement. Reference actual file names, function names, or patterns you see in the code. Do NOT invent issues that don't exist in the provided code. Only mention problems you can point to in the actual files.

**Closing**: One sentence on what this project demonstrates about the developer's capabilities.

RULES:
- NEVER copy example phrases from this prompt into your response.
- NEVER invent technologies or layers not present in the code (e.g. don't mention WebSocket if there is no WebSocket code).
- Only critique what you actually see. If error handling exists, say so.
- Write in paragraphs, NOT numbered lists. 200-300 words total.`,

        ru: `Ты — старший инженерный консультант, оценивающий проект из портфолио разработчика. Текущая дата: ${currentDate}.

Твоя аудитория — технический рекрутер, engineering manager или CTO, оценивающий возможности разработчика.

Пиши narrative-оценку (НЕ нумерованный список). Структура — связные абзацы:

**Первый абзац**: Что делает проект и какую проблему решает. Покажи что понимаешь домен.

**Архитектура и инженерия**: Оцени технические решения — выбор стека, структуру проекта, разделение ответственности. Отметь что сделано хорошо и что нестандартно, но оправданно.

**Production-готовность**: Может ли этот код работать в продакшене? Обрати внимание на: обработку ошибок, безопасность, настройку деплоя, качество документации.

**Честная оценка**: Конкретно о сильных сторонах И областях для улучшения. Ссылайся на реальные файлы, функции и паттерны из предоставленного кода. НЕ выдумывай проблемы которых нет. Если обработка ошибок есть — скажи об этом. Критикуй только то что реально видишь.

**Заключение**: Одно предложение о том, что этот проект демонстрирует о возможностях разработчика.

ПРАВИЛА:
- НИКОГДА не копируй примерные фразы из этого промта в свой ответ.
- НИКОГДА не выдумывай технологии или слои которых нет в коде.
- Критикуй только то что реально видишь в предоставленных файлах.
- Пиши абзацами, НЕ нумерованными списками. 200-300 слов.`,
      },
      file: {
        en: `You are a senior engineer reviewing a single file from a developer's portfolio. Current date: ${currentDate}.

Write a concise narrative review (NOT a numbered list), 150-250 words in flowing paragraphs:

- What this file does and how it fits into the larger system
- Notable engineering decisions (good or questionable)
- Specific strengths worth highlighting
- Concrete improvements (if any) — not generic advice, but specific to THIS code
- One-line verdict: what this code says about the developer

Be specific and evidence-based. Reference actual function names, patterns, or line-level decisions. Avoid generic statements.

TONE: Like a pull request review from a senior colleague — constructive, specific, professional.`,

        ru: `Ты — старший инженер, делающий ревью одного файла из портфолио разработчика. Текущая дата: ${currentDate}.

Напиши краткий narrative-обзор (НЕ нумерованный список), 150-250 слов связными абзацами:

- Что делает этот файл и как вписывается в систему
- Примечательные инженерные решения (хорошие или спорные)
- Конкретные сильные стороны
- Конкретные улучшения (если есть) — не общие советы, а специфичные для ЭТОГО кода
- Одна строка вердикта: что этот код говорит о разработчике

Будь конкретен и опирайся на доказательства. Ссылайся на реальные имена функций, паттерны, решения на уровне строк. Избегай общих утверждений.

ТОНАЛЬНОСТЬ: Как pull request review от старшего коллеги — конструктивно, конкретно, профессионально.`,
      },
    };

    const langKey = language === "ru" ? "ru" : "en";
    const systemPrompt = systemPrompts[mode]?.[langKey] || systemPrompts.file[langKey];

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: code },
    ];
    const maxTokens = mode === "repo" ? 1024 : 4096;

    // Provider rotation: Groq 70b → Cerebras 70b → Groq 8b
    const providers = [
      {
        url: "https://api.groq.com/openai/v1/chat/completions",
        key: process.env.GROQ_API_KEY!,
        model: "llama-3.3-70b-versatile",
        name: "Groq-70b",
      },
      {
        url: "https://api.cerebras.ai/v1/chat/completions",
        key: process.env.CEREBRAS_API_KEY || "",
        model: "llama-3.3-70b",
        name: "Cerebras-70b",
      },
      {
        url: "https://api.groq.com/openai/v1/chat/completions",
        key: process.env.GROQ_API_KEY!,
        model: "llama-3.1-8b-instant",
        name: "Groq-8b",
      },
    ].filter(p => p.key); // Skip providers without API key

    let response: Response | null = null;
    let usedProvider = "";

    for (const provider of providers) {
      try {
        response = await fetch(provider.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${provider.key}`,
          },
          body: JSON.stringify({
            model: provider.model,
            messages,
            temperature: 0.5,
            max_tokens: maxTokens,
            stream: true,
          }),
          signal: AbortSignal.timeout(15000),
        });

        if (response.ok) {
          usedProvider = provider.name;
          console.log(`[API /analyze-code] Using ${provider.name}`);
          break;
        }

        console.log(`[API /analyze-code] ${provider.name} returned ${response.status}, trying next`);
      } catch (error) {
        console.log(`[API /analyze-code] ${provider.name} failed, trying next`);
      }
    }

    if (!response || !response.ok) {
      return new Response("AI service temporarily unavailable. Please try again.", { status: 503 });
    }

    // Stream SSE response
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const reader = response.body!.getReader();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          let buffer = "";
          let fullResult = "";
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
                  fullResult += content;
                  controller.enqueue(encoder.encode(content));
                }
              } catch {
                // Skip malformed chunks
              }
            }
          }

          // Cache the complete result
          if (fullResult.length > 50) {
            setCache(codeHash, fullResult, mode, language);
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
    return new Response("Analysis failed. Please try again.", { status: 500 });
  }
}
