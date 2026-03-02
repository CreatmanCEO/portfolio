import { NextRequest, NextResponse } from "next/server";

type Purpose = "collaborate" | "project" | "hire";

interface ContactRequest {
  name: string;
  contact: string;
  purpose: Purpose;
  message?: string;
}

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: NextRequest) {
  try {
    const body: ContactRequest = await request.json();

    // Validate required fields
    if (!body.name || !body.contact || !body.purpose) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error("Missing Telegram configuration");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Map purpose to emoji
    const purposeEmoji: Record<Purpose, string> = {
      collaborate: "🤝",
      project: "💼",
      hire: "👔",
    };

    // Format message for Telegram
    const telegramMessage = `
${purposeEmoji[body.purpose]} <b>New Contact Form Submission</b>

<b>Name:</b> ${body.name}
<b>Contact:</b> ${body.contact}
<b>Purpose:</b> ${body.purpose}
${body.message ? `\n<b>Message:</b>\n${body.message}` : ""}

<i>Sent from portfolio contact form</i>
    `.trim();

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const telegramResponse = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: "HTML",
      }),
    });

    if (!telegramResponse.ok) {
      const error = await telegramResponse.json();
      console.error("Telegram API error:", error);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
