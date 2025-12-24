#!/usr/bin/env ts-node

// Local sync script for development
// This script directly calls the sync functions without needing API authentication

import { syncAllWorkflows } from "../src/lib/github/sync";

async function main() {
  console.log("🚀 Starting local workflow sync...");

  try {
    const result = await syncAllWorkflows();

    console.log("\n✅ Sync completed successfully!");
    console.log("\nResults:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("\n❌ Sync failed:", error);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  main();
}
