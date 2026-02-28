"use client";

import React, { useState, useEffect } from "react";

interface FileNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileNode[];
}

interface FileTreeProps {
  onFileSelect: (path: string, type: "file" | "directory") => void;
  repository?: { name: string; owner: string; branch: string };
}

export default function FileTree({ onFileSelect, repository }: FileTreeProps) {
  const [tree, setTree] = useState<FileNode[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFileTree();
  }, [repository]);

  const loadFileTree = async () => {
    if (repository) {
      // Load from GitHub API
      setLoading(true);
      try {
        const response = await fetch(
          `/api/github-tree?owner=${repository.owner}&repo=${repository.name}&branch=${repository.branch}`
        );
        if (response.ok) {
          const data = await response.json();
          setTree(data);
          setExpanded(new Set(["src"]));
        } else {
          console.error("Failed to load file tree from GitHub");
          loadDefaultTree();
        }
      } catch (error) {
        console.error("Error loading file tree:", error);
        loadDefaultTree();
      } finally {
        setLoading(false);
      }
    } else {
      loadDefaultTree();
    }
  };

  const loadDefaultTree = () => {
    // Build a simple file tree of the portfolio project
    const portfolioTree: FileNode[] = [
      {
        name: "src",
        path: "src",
        type: "directory",
        children: [
          {
            name: "app",
            path: "src/app",
            type: "directory",
            children: [
              { name: "page.tsx", path: "src/app/page.tsx", type: "file" },
              { name: "layout.tsx", path: "src/app/layout.tsx", type: "file" },
              { name: "globals.css", path: "src/app/globals.css", type: "file" },
              {
                name: "ai-analyst",
                path: "src/app/ai-analyst",
                type: "directory",
                children: [
                  { name: "page.tsx", path: "src/app/ai-analyst/page.tsx", type: "file" },
                ],
              },
              {
                name: "api",
                path: "src/app/api",
                type: "directory",
                children: [
                  {
                    name: "analyze-code",
                    path: "src/app/api/analyze-code",
                    type: "directory",
                    children: [
                      { name: "route.ts", path: "src/app/api/analyze-code/route.ts", type: "file" },
                    ],
                  },
                ],
              },
              {
                name: "projects",
                path: "src/app/projects",
                type: "directory",
                children: [
                  { name: "page.tsx", path: "src/app/projects/page.tsx", type: "file" },
                ],
              },
            ],
          },
          {
            name: "components",
            path: "src/components",
            type: "directory",
            children: [
              { name: "Hero.tsx", path: "src/components/Hero.tsx", type: "file" },
              { name: "Navigation.tsx", path: "src/components/Navigation.tsx", type: "file" },
              { name: "ProjectCard.tsx", path: "src/components/ProjectCard.tsx", type: "file" },
              { name: "ThemeProvider.tsx", path: "src/components/ThemeProvider.tsx", type: "file" },
              { name: "ThemeToggle.tsx", path: "src/components/ThemeToggle.tsx", type: "file" },
            ],
          },
          {
            name: "lib",
            path: "src/lib",
            type: "directory",
            children: [
              { name: "theme.ts", path: "src/lib/theme.ts", type: "file" },
            ],
          },
        ],
      },
      {
        name: "public",
        path: "public",
        type: "directory",
        children: [
          { name: "next.svg", path: "public/next.svg", type: "file" },
          { name: "vercel.svg", path: "public/vercel.svg", type: "file" },
        ],
      },
      { name: "package.json", path: "package.json", type: "file" },
      { name: "tsconfig.json", path: "tsconfig.json", type: "file" },
      { name: "tailwind.config.ts", path: "tailwind.config.ts", type: "file" },
      { name: "next.config.ts", path: "next.config.ts", type: "file" },
      { name: "README.md", path: "README.md", type: "file" },
    ];

    setTree(portfolioTree);
    // Auto-expand src folder
    setExpanded(new Set(["src"]));
  };

  const toggleExpand = (path: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpanded(newExpanded);
  };

  const handleSelect = (node: FileNode) => {
    setSelected(node.path);
    onFileSelect(node.path, node.type);
    if (node.type === "directory") {
      toggleExpand(node.path);
    }
  };

  const renderNode = (node: FileNode, level: number = 0): React.ReactElement => {
    const isExpanded = expanded.has(node.path);
    const isSelected = selected === node.path;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.path}>
        <div
          onClick={() => handleSelect(node)}
          className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm transition-colors hover:bg-surface ${
            isSelected ? "bg-accent/10 text-accent" : ""
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {node.type === "directory" && (
            <span className="text-xs">{isExpanded ? "▼" : "▶"}</span>
          )}
          {node.type === "directory" ? (
            <span className="text-accent">📁</span>
          ) : (
            <span className="text-muted">📄</span>
          )}
          <span className="truncate">{node.name}</span>
        </div>
        {node.type === "directory" && isExpanded && node.children && (
          <div>
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto border-r border-border bg-background p-2">
      <div className="mb-4 px-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
          {repository ? repository.name : "Portfolio Explorer"}
        </h3>
      </div>
      {loading ? (
        <div className="flex items-center justify-center p-4">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      ) : (
        <div>{tree.map((node) => renderNode(node))}</div>
      )}
    </div>
  );
}
