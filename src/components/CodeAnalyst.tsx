"use client";

import { useState } from "react";

export default function CodeAnalyst() {
  const [code, setCode] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeCode = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setAnalysis("");

    try {
      const response = await fetch("/api/analyze-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) throw new Error("Analysis failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response stream");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setAnalysis((prev) => prev + chunk);
      }
    } catch (error) {
      setAnalysis("Error: Unable to analyze code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          AI Code Analyst
        </h2>
        <p className="text-lg text-muted">
          Paste your code below and get instant AI-powered analysis using
          Claude
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Code Input */}
        <div>
          <label className="mb-2 block text-sm font-medium">Your Code</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            className="h-96 w-full rounded-lg border border-border bg-surface p-4 font-mono text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
          <button
            onClick={analyzeCode}
            disabled={!code.trim() || loading}
            className="mt-4 w-full rounded-full bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Code"}
          </button>
        </div>

        {/* Analysis Output */}
        <div>
          <label className="mb-2 block text-sm font-medium">Analysis</label>
          <div className="h-96 overflow-y-auto rounded-lg border border-border bg-code-bg p-4">
            {analysis ? (
              <pre className="whitespace-pre-wrap text-sm">{analysis}</pre>
            ) : (
              <p className="text-sm text-muted">
                Analysis will appear here...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
