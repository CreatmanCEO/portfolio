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
  const [fileContent, setFileContent] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [isMobile, setIsMobile] = useState(false);
  const [treeCollapsed, setTreeCollapsed] = useState(true);
  const [editorCollapsed, setEditorCollapsed] = useState(false);
  const [currentRepo, setCurrentRepo] = useState<{ name: string; owner: string; branch: string } | undefined>();

  // Request ID to prevent stale responses from overwriting current analysis
  const requestIdRef = useRef(0);
  const isAnalyzingRepoRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleFileSelect = async (path: string, type: "file" | "directory") => {
    if (type === "file") {
      setSelectedFile(path);
    }
  };

  const handleContentChange = async (content: string) => {
    setFileContent(content);

    // Don't auto-analyze if we're doing repo analysis
    if (isAnalyzingRepoRef.current) return;

    // Auto-analyze when new file content loads
    if (content && selectedFile) {
      await runAnalysis(content, "file");
    }
  };

  const handleAnalyzeSelection = async (code: string) => {
    await runAnalysis(code, "file");
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const handleProjectSelect = (repo: Repository) => {
    const owner = repo.full_name.split("/")[0];
    setCurrentRepo({ name: repo.name, owner, branch: repo.default_branch });
    setSelectedFile("");
    setFileContent("");
    setAnalysis("");
    setLoading(true);
    isAnalyzingRepoRef.current = true;

    // Fetch context and analyze
    (async () => {
      try {
        const [readmeText, treeData] = await Promise.all([
          fetch(`/api/read-file?owner=${owner}&repo=${repo.name}&path=README.md&branch=${repo.default_branch}`)
            .then(r => r.ok ? r.text() : "").catch(() => ""),
          fetch(`/api/github-tree?owner=${owner}&repo=${repo.name}&branch=${repo.default_branch}`)
            .then(r => r.ok ? r.json() : []).catch(() => []),
        ]);

        // Flatten tree
        const paths: string[] = [];
        const flatten = (nodes: { path: string; type: string; children?: unknown[] }[]) => {
          for (const n of nodes) {
            if (n.type === "file") paths.push(n.path);
            if (n.children) flatten(n.children as typeof nodes);
          }
        };
        flatten(Array.isArray(treeData) ? treeData : []);

        const parts = [`Repository: ${repo.full_name}`];
        if (repo.description) parts.push(`Description: ${repo.description}`);
        if (paths.length > 0) parts.push(`\nArchitecture (file paths):\n${JSON.stringify(paths.slice(0, 60))}`);
        if (readmeText) parts.push(`\nREADME (excerpt):\n${readmeText.slice(0, 1500)}`);

        await runAnalysis(parts.join("\n"), "repo");
      } catch {
        setLoading(false);
        setAnalysis("Failed to load project. Select a file to analyze.");
      } finally {
        isAnalyzingRepoRef.current = false;
      }
    })();
  };

  const savePanelSizes = (sizes: number[]) => {
    localStorage.setItem("ai-analyst-panel-sizes", JSON.stringify(sizes));
  };

  // Core analysis function with stale-response protection
  const runAnalysis = async (code: string, mode: "file" | "repo") => {
    const myId = ++requestIdRef.current;

    setLoading(true);
    setAnalysis("");

    try {
      const response = await fetch("/api/analyze-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, mode }),
      });

      // Stale check — a newer request was started
      if (requestIdRef.current !== myId) return;

      if (!response.ok) {
        setAnalysis(response.status === 503
          ? "AI service temporarily unavailable. Please try again."
          : "Analysis failed. Please try again.");
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        setAnalysis("No response stream available.");
        return;
      }

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (requestIdRef.current !== myId) { reader.cancel(); return; }
        const chunk = decoder.decode(value, { stream: true });
        setAnalysis(prev => prev + chunk);
      }
    } catch (error) {
      if (requestIdRef.current !== myId) return;
      setAnalysis("Error: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      if (requestIdRef.current === myId) setLoading(false);
    }
  };

  if (isMobile) {
    return (
      <div className="flex h-full flex-col overflow-hidden px-2 sm:px-4">
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

        {/* Collapsible Code Editor */}
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

        {/* Analysis Panel */}
        <div className="flex-1 overflow-hidden">
          <AnalysisPanel analysis={analysis} loading={loading} onLanguageChange={handleLanguageChange} />
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="h-full overflow-hidden">
      <ProjectSelector onProjectSelect={handleProjectSelect} currentProject={currentRepo?.name} />

      <div className="h-[calc(100%-64px)] px-4 md:px-6 lg:px-8">
        <Group
          orientation="horizontal"
          onLayoutChanged={(layout) => savePanelSizes(Object.values(layout))}
          className="h-full"
        >
          <Panel defaultSize={15} minSize={10} maxSize={30}>
            <FileTree onFileSelect={handleFileSelect} repository={currentRepo} />
          </Panel>

          <Separator className="w-1 bg-border transition-colors hover:bg-accent" />

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

          <Panel defaultSize={45} minSize={30} maxSize={70}>
            <AnalysisPanel analysis={analysis} loading={loading} onLanguageChange={handleLanguageChange} />
          </Panel>
        </Group>
      </div>
    </div>
  );
}
