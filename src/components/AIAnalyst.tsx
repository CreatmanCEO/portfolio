"use client";

import { useState, useEffect, useRef } from "react";
import { Panel, Group, Separator } from "react-resizable-panels";
import { ChevronDown } from "lucide-react";
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
  const [editorCollapsed, setEditorCollapsed] = useState(false);
  const [currentRepo, setCurrentRepo] = useState<{ name: string; owner: string; branch: string } | undefined>();
  const abortControllerRef = useRef<AbortController | null>(null);

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
      // Mark that we're waiting for content to load for this file
      pendingAnalysisRef.current = path;
    }
    // Directory clicks only expand the tree — no analysis
  };

  const pendingAnalysisRef = useRef<string | null>(null);

  const handleContentChange = async (content: string) => {
    setFileContent(content);

    // Only auto-analyze if this content load was triggered by a file selection
    if (content && pendingAnalysisRef.current && selectedFile) {
      pendingAnalysisRef.current = null; // Clear — only analyze once per file select
      await analyzeCode(content, "file");
    }
  };

  const handleAnalyzeSelection = async (code: string) => {
    await analyzeCode(code, "selection");
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const handleProjectSelect = async (repo: Repository) => {
    const owner = repo.full_name.split("/")[0];
    setCurrentRepo({
      name: repo.name,
      owner,
      branch: repo.default_branch,
    });
    setSelectedFile("");
    setAnalysis("");

    // Fetch README + compact architecture JSON
    try {
      // Fetch README
      let readmeContent = "";
      try {
        const readmeRes = await fetch(
          `/api/read-file?owner=${owner}&repo=${repo.name}&path=README.md&branch=${repo.default_branch}`
        );
        if (readmeRes.ok) {
          readmeContent = await readmeRes.text();
        }
      } catch {
        // No README available
      }

      // Fetch tree via our proxy (has GITHUB_TOKEN for private repos)
      let architecture = "";
      try {
        const treeRes = await fetch(
          `/api/github-tree?owner=${owner}&repo=${repo.name}&branch=${repo.default_branch}`
        );
        if (treeRes.ok) {
          const treeData = await treeRes.json();
          // Flatten nested tree to compact path list
          const paths: string[] = [];
          const flatten = (nodes: { path: string; type: string; children?: unknown[] }[]) => {
            for (const n of nodes) {
              if (n.type === "file") paths.push(n.path);
              if (n.children) flatten(n.children as typeof nodes);
            }
          };
          flatten(Array.isArray(treeData) ? treeData : []);
          if (paths.length > 0) {
            architecture = JSON.stringify(paths.slice(0, 80));
          }
        }
      } catch {
        // No tree available
      }

      // Build compact context for AI
      const context = [
        `Repository: ${repo.full_name}`,
        repo.description ? `Description: ${repo.description}` : "",
        architecture ? `\nArchitecture (file paths JSON):\n${architecture}` : "",
        readmeContent ? `\nREADME.md (first 2000 chars):\n${readmeContent.slice(0, 2000)}` : "",
      ].filter(Boolean).join("\n");

      if (context.length > 50) {
        setSelectedFile("README.md");
        await analyzeCode(context, "repo");
      } else {
        setAnalysis(`Repository loaded: ${repo.full_name}. Select a file to analyze.`);
      }
    } catch (error) {
      console.error("[AIAnalyst] Failed to load project context:", error);
      setAnalysis(`Repository loaded: ${repo.full_name}. Select a file to analyze.`);
    }
  };

  const analyzeCode = async (code: string, type: "file" | "directory" | "selection" | "repo") => {
    // Cancel any previous analysis
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setAnalysis("");

    try {
      const mode = type === "repo" ? "repo" : "file";

      const response = await fetch("/api/analyze-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, mode }),
        signal: controller.signal,
      });

      console.log("[AIAnalyst] Analysis response status:", response.status);

      if (!response.ok) {
        console.error("[AIAnalyst] Analysis failed:", response.status);
        if (response.status === 503) {
          throw new Error("AI service temporarily unavailable. Please try again.");
        }
        throw new Error("Analysis failed. Please try again.");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        console.error("[AIAnalyst] No response stream available");
        throw new Error("No response stream");
      }

      let chunkCount = 0;

      while (true) {
        // Stop if this analysis was cancelled
        if (controller.signal.aborted) {
          reader.cancel();
          return;
        }

        const { done, value } = await reader.read();
        if (done) break;

        chunkCount++;
        const chunk = decoder.decode(value, { stream: true });
        setAnalysis((prev) => prev + chunk);
      }
    } catch (error) {
      // Ignore abort errors (expected when new analysis replaces old)
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("[AIAnalyst] Analysis error:", error);
      setAnalysis(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (isMobile) {
    // Mobile Layout: Vertical stack with collapsible panels
    return (
      <div className="flex h-full flex-col overflow-hidden px-2 sm:px-4">
        {/* Project Selector */}
        <ProjectSelector onProjectSelect={handleProjectSelect} currentProject={currentRepo?.name} />

        {/* Collapsible File Tree */}
        <div className="border-b border-border">
          <button
            onClick={() => setTreeCollapsed(!treeCollapsed)}
            className="flex w-full items-center justify-between bg-surface px-4 py-3 text-sm font-medium"
          >
            <span>📁 File Explorer</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${!treeCollapsed ? "rotate-180" : ""}`} />
          </button>
          <div className={`transition-all duration-300 ${treeCollapsed ? "max-h-0 overflow-hidden" : "max-h-64 overflow-y-auto"}`}>
            <FileTree onFileSelect={handleFileSelect} repository={currentRepo} />
          </div>
        </div>

        {/* Collapsible Code Editor — ~30% */}
        <div className="border-b border-border">
          <button
            onClick={() => setEditorCollapsed(!editorCollapsed)}
            className="flex w-full items-center justify-between bg-surface px-4 py-3 text-sm font-medium"
          >
            <span>📝 Code Editor</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${!editorCollapsed ? "rotate-180" : ""}`} />
          </button>
          <div className={`transition-all duration-300 ${editorCollapsed ? "max-h-0 overflow-hidden" : "h-[35vh] min-h-[200px]"}`}>
            <CodeEditor
              filePath={selectedFile}
              onAnalyzeSelection={handleAnalyzeSelection}
              onContentChange={handleContentChange}
              repository={currentRepo}
              hasRepository={!!currentRepo}
            />
          </div>
        </div>

        {/* Analysis Panel — fills remaining space (~70%) */}
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
    <div className="h-full overflow-hidden">
      {/* Project Selector */}
      <ProjectSelector onProjectSelect={handleProjectSelect} currentProject={currentRepo?.name} />

      <div className="h-[calc(100%-64px)] px-4 md:px-6 lg:px-8">
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
