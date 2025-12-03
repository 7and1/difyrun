// GitHub client singleton using Octokit

import { Octokit } from 'octokit';

let octokitInstance: Octokit | null = null;

export function getOctokit(): Octokit {
  if (!octokitInstance) {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('GITHUB_TOKEN environment variable is required');
    }
    octokitInstance = new Octokit({ auth: token });
  }
  return octokitInstance;
}

// Check rate limit status
export async function checkRateLimit() {
  const octokit = getOctokit();
  const { data } = await octokit.rest.rateLimit.get();
  return {
    remaining: data.rate.remaining,
    limit: data.rate.limit,
    resetAt: new Date(data.rate.reset * 1000),
  };
}

// Reset singleton (useful for testing)
export function resetOctokitInstance() {
  octokitInstance = null;
}
