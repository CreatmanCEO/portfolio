"use client";

import { useState } from "react";

interface AnalysisPanelProps {
  analysis: string;
  loading: boolean;
  onLanguageChange: (language: string) => void;
}

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "he", name: "עברית", flag: "🇮🇱" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
];

export default function AnalysisPanel({
  analysis,
  loading,
  onLanguageChange,
}: AnalysisPanelProps) {
  const [selectedLang, setSelectedLang] = useState("en");

  const handleLanguageChange = (langCode: string) => {
    setSelectedLang(langCode);
    onLanguageChange(langCode);
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Language Selector */}
      <div className="border-b border-border bg-surface px-4 py-3">
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-muted">Analysis Language:</label>
          <div className="flex gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`rounded px-3 py-1 text-xs font-medium transition-all ${
                  selectedLang === lang.code
                    ? "bg-accent text-white"
                    : "bg-surface text-foreground hover:bg-accent/10 border border-border"
                }`}
                title={lang.name}
              >
                <span className="mr-1">{lang.flag}</span>
                {lang.code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-start gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent"></div>
            <div className="space-y-2">
              <div className="h-4 w-64 animate-pulse rounded bg-border"></div>
              <div className="h-4 w-48 animate-pulse rounded bg-border"></div>
              <div className="h-4 w-56 animate-pulse rounded bg-border"></div>
            </div>
          </div>
        ) : analysis ? (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
              {analysis}
            </pre>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-center">
            <div className="space-y-2">
              <div className="text-4xl">🤖</div>
              <p className="text-sm font-medium text-foreground">
                AI Analysis Ready
              </p>
              <p className="text-xs text-muted">
                Select a file or directory from the tree, or highlight code in the editor to analyze
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
