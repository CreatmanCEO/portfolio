"use client";

import AIAnalyst from "@/components/AIAnalyst";

export default function AIAnalystPage() {
  return (
    <main className="flex h-screen flex-col overflow-hidden">
      <div className="border-b border-border bg-surface px-6 py-4">
        <h1 className="text-lg font-medium">Explore My Code — AI-Powered Portfolio</h1>
        <p className="text-xs text-muted">Browse my GitHub repos. Click any file. Get instant AI analysis from Gemini.</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <AIAnalyst />
      </div>
    </main>
  );
}
