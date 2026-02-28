"use client";

import Editor from "@monaco-editor/react";
import { useState, useEffect } from "react";

interface CodeEditorProps {
  filePath: string;
  onAnalyzeSelection: (code: string) => void;
}

export default function CodeEditor({ filePath, onAnalyzeSelection }: CodeEditorProps) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [selectedCode, setSelectedCode] = useState("");
  const [theme, setTheme] = useState("vs-dark");

  useEffect(() => {
    // Watch for theme changes
    const updateTheme = () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      setTheme(isDark ? "vs-dark" : "light");
    };

    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Load file content
    const loadFile = async () => {
      try {
        const response = await fetch(`/api/read-file?path=${encodeURIComponent(filePath)}`);
        if (response.ok) {
          const content = await response.text();
          setCode(content);
        } else {
          setCode(`// File not found: ${filePath}\n// This is a demo view of the portfolio structure.`);
        }
      } catch (error) {
        setCode(`// Error loading file: ${filePath}`);
      }
    };

    if (filePath) {
      loadFile();

      // Detect language from file extension
      const ext = filePath.split(".").pop()?.toLowerCase();
      const langMap: { [key: string]: string } = {
        ts: "typescript",
        tsx: "typescript",
        js: "javascript",
        jsx: "javascript",
        json: "json",
        css: "css",
        md: "markdown",
        html: "html",
      };
      setLanguage(langMap[ext || ""] || "plaintext");
    }
  }, [filePath]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleEditorDidMount = (editor: any) => {
    // Listen for selection changes
    editor.onDidChangeCursorSelection((e: any) => {
      const selection = editor.getModel()?.getValueInRange(e.selection);
      setSelectedCode(selection || "");
    });
  };

  return (
    <div className="flex h-full flex-col border-r border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">File:</span>
          <span className="text-sm font-medium">{filePath || "No file selected"}</span>
        </div>
        {selectedCode && (
          <button
            onClick={() => onAnalyzeSelection(selectedCode)}
            className="rounded bg-accent px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Analyze Selection
          </button>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        {filePath ? (
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme={theme}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: "on",
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            <p className="text-sm">Select a file from the tree to view its contents</p>
          </div>
        )}
      </div>
    </div>
  );
}
