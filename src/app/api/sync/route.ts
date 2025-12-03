// Sync API endpoint - triggers GitHub to D1 synchronization

import { NextRequest, NextResponse } from 'next/server';
import { syncAllWorkflows, syncSingleRepo } from '@/lib/github/sync';
import { getRepoSources } from '@/lib/db';

// Verify authorization
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;

  const token = authHeader.replace('Bearer ', '');
  const syncSecret = process.env.SYNC_SECRET;

  if (!syncSecret) {
    console.error('SYNC_SECRET not configured');
    return false;
  }

  return token === syncSecret;
}

export async function POST(request: NextRequest) {
  // Verify authorization
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse request body
    let body: { repoId?: string } = {};
    try {
      body = await request.json();
    } catch {
      // Empty body is fine - sync all repos
    }

    let result;

    if (body.repoId) {
      // Sync single repository
      console.log(`Starting sync for repository: ${body.repoId}`);
      result = await syncSingleRepo(body.repoId);
    } else {
      // Sync all repositories
      console.log('Starting sync for all repositories');
      result = await syncAllWorkflows();
    }

    console.log('Sync completed:', result);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Sync failed:', error);

    return NextResponse.json(
      {
        error: 'Sync failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Get sync status (last sync info)
export async function GET(request: NextRequest) {
  // Verify authorization
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get repo source statuses
    const sources = await getRepoSources(false);

    return NextResponse.json({
      lastSync: null, // TODO: Add sync_logs query when needed
      sources: sources.map(s => ({
        id: s.id,
        name: s.name,
        last_synced_at: s.last_synced_at,
        last_sync_error: s.last_sync_error,
        total_workflows: s.total_workflows,
        is_active: s.is_active,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to get sync status',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
