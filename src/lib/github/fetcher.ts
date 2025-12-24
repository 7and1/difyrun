// GitHub file fetcher with concurrency control

import { getOctokit } from "./client";
import pLimit from "p-limit";

export interface RepoConfig {
  id: string;
  owner: string;
  repo: string;
  branch: string;
  rootPath?: string;
  excludePaths?: string[];
  defaultTags?: string[];
}

export interface FileEntry {
  path: string;
  sha: string;
  size: number;
  url: string;
}

// Fetch entire file tree in ONE request (critical for rate limiting)
export async function fetchFileTree(config: RepoConfig): Promise<FileEntry[]> {
  const octokit = getOctokit();

  try {
    const { data } = await octokit.rest.git.getTree({
      owner: config.owner,
      repo: config.repo,
      tree_sha: config.branch,
      recursive: "true", // CRITICAL: Gets all files in one request
    });

    // Filter for YAML files
    const yamlFiles = data.tree.filter((item) => {
      // Must be a file (blob)
      if (item.type !== "blob") return false;

      // Must be YAML
      if (!item.path?.match(/\.ya?ml$/i)) return false;

      // Apply root path filter
      if (config.rootPath && !item.path.startsWith(config.rootPath)) {
        return false;
      }

      // Exclude specific paths
      if (config.excludePaths) {
        for (const exclude of config.excludePaths) {
          if (item.path.includes(exclude)) return false;
        }
      }

      return true;
    });

    return yamlFiles.map((item) => ({
      path: item.path!,
      sha: item.sha!,
      size: item.size || 0,
      url: `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}/${item.path}`,
    }));
  } catch (error) {
    console.error(
      `Failed to fetch tree for ${config.owner}/${config.repo}:`,
      error,
    );
    throw error;
  }
}

// Create concurrency limiter
const limit = pLimit(5); // Max 5 concurrent requests

// Fetch file content with concurrency control
export async function fetchFileContent(
  config: RepoConfig,
  file: FileEntry,
): Promise<string> {
  return limit(async () => {
    const octokit = getOctokit();

    try {
      const { data } = await octokit.rest.repos.getContent({
        owner: config.owner,
        repo: config.repo,
        path: file.path,
        ref: config.branch,
      });

      if ("content" in data && data.encoding === "base64") {
        return Buffer.from(data.content, "base64").toString("utf-8");
      }

      throw new Error(`Unexpected response format for ${file.path}`);
    } catch (error) {
      console.error(`Failed to fetch content for ${file.path}:`, error);
      throw error;
    }
  });
}

// Batch fetch all file contents
export async function fetchAllContents(
  config: RepoConfig,
  files: FileEntry[],
): Promise<Map<string, string>> {
  const contents = new Map<string, string>();

  await Promise.all(
    files.map(async (file) => {
      try {
        const content = await fetchFileContent(config, file);
        contents.set(file.path, content);
      } catch (error) {
        // Log but don't fail entire sync for one file
        console.error(`Skipping ${file.path}: ${error}`);
      }
    }),
  );

  return contents;
}
