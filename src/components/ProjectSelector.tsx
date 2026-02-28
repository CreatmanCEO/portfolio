"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Github, Loader2 } from "lucide-react";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  default_branch: string;
  language: string | null;
}

interface ProjectSelectorProps {
  onProjectSelect: (repo: Repository) => void;
  currentProject?: string;
}

export default function ProjectSelector({ onProjectSelect, currentProject }: ProjectSelectorProps) {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("[ProjectSelector] Fetching repositories from GitHub API...");

      const response = await fetch("https://api.github.com/users/CreatmanCEO/repos?sort=updated&per_page=20", {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      console.log("[ProjectSelector] Response status:", response.status);
      console.log("[ProjectSelector] Response headers:", {
        'x-ratelimit-remaining': response.headers.get('x-ratelimit-remaining'),
        'x-ratelimit-limit': response.headers.get('x-ratelimit-limit'),
        'x-ratelimit-reset': response.headers.get('x-ratelimit-reset'),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[ProjectSelector] API Error:", errorText);
        throw new Error(`GitHub API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("[ProjectSelector] Fetched repos count:", data.length);
      console.log("[ProjectSelector] First 3 repos:", data.slice(0, 3).map((r: Repository) => r.name));

      setRepos(data);

      // Set current portfolio as default
      const portfolioRepo = data.find((repo: Repository) => repo.name === "portfolio");
      if (portfolioRepo) {
        console.log("[ProjectSelector] Setting default repo:", portfolioRepo.name);
        setSelectedRepo(portfolioRepo);
      } else {
        console.log("[ProjectSelector] Portfolio repo not found, available repos:", data.map((r: Repository) => r.name));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to load repositories: ${errorMessage}`);
      console.error("[ProjectSelector] Error fetching repos:", err);

      // Fallback: provide manual repo entry
      console.log("[ProjectSelector] Using fallback - empty repo list");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRepo = (repo: Repository) => {
    setSelectedRepo(repo);
    setIsOpen(false);
    onProjectSelect(repo);
  };

  return (
    <div className="relative w-full border-b border-border bg-surface">
      <div className="px-4 py-3">
        <label className="mb-2 block text-xs font-medium text-muted-foreground">
          Project Repository
        </label>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors hover:bg-accent/5 focus:outline-none focus:ring-2 focus:ring-accent"
          disabled={loading}
        >
          <div className="flex items-center gap-2">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Github className="h-4 w-4" />
            )}
            <span className="truncate">
              {selectedRepo ? selectedRepo.full_name : currentProject || "Select a project..."}
            </span>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {error && (
          <p className="mt-2 text-xs text-red-500">{error}</p>
        )}

        {/* Dropdown Menu */}
        {isOpen && !loading && (
          <div className="absolute left-4 right-4 top-full z-50 mt-1 max-h-96 overflow-y-auto rounded-lg border border-border bg-surface shadow-lg">
            {repos.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No repositories found
              </div>
            ) : (
              <div className="py-1">
                {repos.map((repo) => (
                  <button
                    key={repo.id}
                    onClick={() => handleSelectRepo(repo)}
                    className={`flex w-full flex-col items-start gap-1 px-4 py-3 text-left transition-colors hover:bg-accent/10 ${
                      selectedRepo?.id === repo.id ? "bg-accent/5" : ""
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="font-medium text-sm">{repo.name}</span>
                      {repo.language && (
                        <span className="text-xs text-muted-foreground">
                          {repo.language}
                        </span>
                      )}
                    </div>
                    {repo.description && (
                      <span className="text-xs text-muted-foreground line-clamp-2">
                        {repo.description}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
