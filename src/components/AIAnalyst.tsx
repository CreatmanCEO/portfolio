"use client";

import { useState, useEffect } from "react";
import { Panel, Group, Separator } from "react-resizable-panels";
import FileTree from "./FileTree";
import CodeEditor from "./CodeEditor";
import AnalysisPanel from "./AnalysisPanel";
import ProjectSelector from "./ProjectSelector";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  default_branch: string;
  language: string | null;
}

export default function AIAnalyst() {
  const [selectedFile, setSelectedFile] = useState("");
  const [fileContent, setFileContent] = useState(""); // Store loaded file content
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [isMobile, setIsMobile] = useState(false);
  const [treeCollapsed, setTreeCollapsed] = useState(true);
  const [currentRepo, setCurrentRepo] = useState<{ name: string; owner: string; branch: string } | undefined>();

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Load saved panel sizes from localStorage
    const savedSizes = localStorage.getItem("ai-analyst-panel-sizes");
    if (savedSizes) {
      try {
        const sizes = JSON.parse(savedSizes);
        // Panel sizes will be applied via defaultSize props
      } catch (error) {
        console.error("Failed to load panel sizes:", error);
      }
    }
  }, []);

  const savePanelSizes = (sizes: number[]) => {
    localStorage.setItem("ai-analyst-panel-sizes", JSON.stringify(sizes));
  };

  const handleFileSelect = async (path: string, type: "file" | "directory") => {
    console.log("[AIAnalyst] File selected:", { path, type });

    if (type === "file") {
      setSelectedFile(path);
      // Content will be loaded by CodeEditor and passed via onContentChange
      // Analysis will be triggered automatically when content loads
    } else {
      // For directories, analyze immediately
      await analyzeCode(path, type);
    }
  };

  const handleContentChange = async (content: string) => {
    console.log("[AIAnalyst] Content changed, length:", content.length);
    setFileContent(content);

    // Auto-analyze when file content loads
    if (content && selectedFile) {
      await analyzeCode(content, "file");
    }
  };

  const handleAnalyzeSelection = async (code: string) => {
    await analyzeCode(code, "selection");
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const handleProjectSelect = (repo: Repository) => {
    setCurrentRepo({
      name: repo.name,
      owner: repo.full_name.split("/")[0],
      branch: repo.default_branch,
    });
    setSelectedFile(""); // Clear selected file when switching projects
    setAnalysis(""); // Clear analysis
  };

  const analyzeCode = async (code: string, type: "file" | "directory" | "selection") => {
    console.log("[AIAnalyst] Starting analysis:", { type, codeLength: code.length, language });
    setLoading(true);
    setAnalysis("");

    try {
      let promptCode = code;

      // For files, code is already the content (passed from CodeEditor)
      // For selections, code is the selected text
      // For directories, create a prompt
      if (type === "directory") {
        // For directories, just analyze the structure
        promptCode = `Directory: ${code}\nPlease provide insights about this directory structure and its purpose in the project.`;
        console.log("[AIAnalyst] Directory analysis prompt created");
      }

      console.log("[AIAnalyst] Sending to analysis API...");
      const response = await fetch("/api/analyze-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promptCode, language }),
      });

      console.log("[AIAnalyst] Analysis response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[AIAnalyst] Analysis failed:", errorText);
        throw new Error(`Analysis failed: ${response.status} - ${errorText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        console.error("[AIAnalyst] No response stream available");
        throw new Error("No response stream");
      }

      console.log("[AIAnalyst] Starting stream reading...");
      let chunkCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("[AIAnalyst] Stream complete. Total chunks:", chunkCount);
          break;
        }

        chunkCount++;
        const chunk = decoder.decode(value, { stream: true });
        setAnalysis((prev) => prev + chunk);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("[AIAnalyst] Analysis error:", error);
      setAnalysis(`Error: Unable to analyze. ${errorMessage}`);
    } finally {
      setLoading(false);
      console.log("[AIAnalyst] Analysis complete");
    }
  };

  if (isMobile) {
    // Mobile Layout: Vertical stack with collapsible tree
    return (
      <div className="flex h-screen flex-col overflow-hidden px-2 sm:px-4">
        {/* Project Selector */}
        <ProjectSelector onProjectSelect={handleProjectSelect} currentProject={currentRepo?.name} />

        {/* Collapsible File Tree */}
        <details open={!treeCollapsed} onToggle={(e) => setTreeCollapsed(!(e.target as HTMLDetailsElement).open)} className="border-b border-border">
          <summary className="cursor-pointer bg-surface px-4 py-3 font-medium hover:bg-accent/5">
            <span className="text-sm">📁 File Explorer</span>
          </summary>
          <div className="h-64 overflow-hidden">
            <FileTree onFileSelect={handleFileSelect} repository={currentRepo} />
          </div>
        </details>

        {/* Code Editor */}
        <div className="flex-1 overflow-hidden border-b border-border">
          <CodeEditor
            filePath={selectedFile}
            onAnalyzeSelection={handleAnalyzeSelection}
            onContentChange={handleContentChange}
            repository={currentRepo}
            hasRepository={!!currentRepo}
          />
        </div>

        {/* Analysis Panel */}
        <div className="flex-1 overflow-hidden">
          <AnalysisPanel
            analysis={analysis}
            loading={loading}
            onLanguageChange={handleLanguageChange}
          />
        </div>
      </div>
    );
  }

  // Desktop Layout: 3-panel with resizable separators
  return (
    <div className="h-screen overflow-hidden">
      {/* Project Selector */}
      <ProjectSelector onProjectSelect={handleProjectSelect} currentProject={currentRepo?.name} />

      <div className="h-[calc(100vh-64px)] px-4 md:px-6 lg:px-8">
        <Group
          orientation="horizontal"
          onLayoutChanged={(layout) => {
            const sizes = Object.values(layout);
            savePanelSizes(sizes);
          }}
          className="h-full"
        >
          {/* Left Panel: File Tree (15%) */}
          <Panel defaultSize={15} minSize={10} maxSize={30}>
            <FileTree onFileSelect={handleFileSelect} repository={currentRepo} />
          </Panel>

        <Separator className="w-1 bg-border transition-colors hover:bg-accent" />

        {/* Center Panel: Code Editor (40%) */}
        <Panel defaultSize={40} minSize={20} maxSize={60}>
          <CodeEditor
            filePath={selectedFile}
            onAnalyzeSelection={handleAnalyzeSelection}
            onContentChange={handleContentChange}
            repository={currentRepo}
            hasRepository={!!currentRepo}
          />
        </Panel>

        <Separator className="w-1 bg-border transition-colors hover:bg-accent" />

        {/* Right Panel: AI Analysis (45%) */}
        <Panel defaultSize={45} minSize={30} maxSize={70}>
          <AnalysisPanel
            analysis={analysis}
            loading={loading}
            onLanguageChange={handleLanguageChange}
          />
        </Panel>
        </Group>
      </div>
    </div>
  );
}
