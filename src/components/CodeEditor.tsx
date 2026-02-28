"use client";

import Editor from "@monaco-editor/react";
import { useState, useEffect } from "react";

interface CodeEditorProps {
  filePath: string;
  onAnalyzeSelection: (code: string) => void;
  onContentChange?: (content: string) => void;
  repository?: { name: string; owner: string; branch: string };
  hasRepository: boolean;
}

export default function CodeEditor({ filePath, onAnalyzeSelection, onContentChange, repository, hasRepository }: CodeEditorProps) {
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
        // Build URL with GitHub params if repository is selected
        let fileUrl = `/api/read-file?path=${encodeURIComponent(filePath)}`;
        if (repository) {
          fileUrl += `&owner=${encodeURIComponent(repository.owner)}&repo=${encodeURIComponent(repository.name)}&branch=${encodeURIComponent(repository.branch)}`;
        }

        const response = await fetch(fileUrl);
        if (response.ok) {
          const content = await response.text();
          setCode(content);
          onContentChange?.(content); // Notify parent of content change
        } else {
          const errorMsg = `// File not found: ${filePath}\n// Server returned: ${response.status}`;
          setCode(errorMsg);
          onContentChange?.('');
        }
      } catch (error) {
        setCode(`// Error loading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
  }, [filePath, repository]);

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
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-muted">
            <p className="text-sm text-center">
              {hasRepository
                ? "Select a file from the tree to view its contents"
                : "Please select a repository from the dropdown above"}
            </p>
            {!hasRepository && (
              <div className="max-w-md rounded-lg border border-border bg-surface/50 p-4 text-xs">
                <p className="mb-2 font-medium text-foreground">💡 Get Started:</p>
                <ul className="space-y-1 text-left">
                  <li>• Choose any GitHub repository</li>
                  <li>• Browse files and view code</li>
                  <li>• Get instant AI analysis</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
