import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get("owner") || "CreatmanCEO";
    const repo = searchParams.get("repo");
    const branch = searchParams.get("branch") || "main";

    if (!repo) {
      return new Response("Repository name is required", { status: 400 });
    }

    // Fetch the file tree from GitHub API
    const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        // Add GitHub token if available for higher rate limits
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform GitHub tree to our FileNode structure
    const tree = buildTree(data.tree);

    return new Response(JSON.stringify(tree), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching GitHub tree:", error);
    return new Response("Failed to fetch repository tree", { status: 500 });
  }
}

interface GitHubTreeNode {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url: string;
}

interface FileNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileNode[];
}

function buildTree(githubTree: GitHubTreeNode[]): FileNode[] {
  const root: { [key: string]: FileNode } = {};

  // Filter out common directories to ignore
  const ignorePaths = [".git", "node_modules", ".next", "dist", "build", ".vercel"];

  githubTree.forEach((node) => {
    // Skip ignored paths
    if (ignorePaths.some((ignore) => node.path.startsWith(ignore))) {
      return;
    }

    const parts = node.path.split("/");
    const fileName = parts[parts.length - 1];

    // Create file node
    const fileNode: FileNode = {
      name: fileName,
      path: node.path,
      type: node.type === "tree" ? "directory" : "file",
    };

    if (parts.length === 1) {
      // Root level file/directory
      root[node.path] = fileNode;
    } else {
      // Nested file/directory - find parent
      const parentPath = parts.slice(0, -1).join("/");
      findAndAddChild(Object.values(root), parentPath, fileNode);
    }
  });

  return Object.values(root).sort((a, b) => {
    // Directories first, then alphabetically
    if (a.type === "directory" && b.type === "file") return -1;
    if (a.type === "file" && b.type === "directory") return 1;
    return a.name.localeCompare(b.name);
  });
}

function findAndAddChild(nodes: FileNode[], parentPath: string, child: FileNode): boolean {
  for (const node of nodes) {
    if (node.path === parentPath) {
      if (!node.children) {
        node.children = [];
      }
      node.children.push(child);
      // Sort children
      node.children.sort((a, b) => {
        if (a.type === "directory" && b.type === "file") return -1;
        if (a.type === "file" && b.type === "directory") return 1;
        return a.name.localeCompare(b.name);
      });
      return true;
    }
    if (node.children) {
      if (findAndAddChild(node.children, parentPath, child)) {
        return true;
      }
    }
  }
  return false;
}
