// Feedback API endpoint - handles user feedback on workflows

import { NextRequest, NextResponse } from 'next/server';
import { getWorkflowById, incrementFeedbackCount, insertWorkflowFeedback } from '@/lib/db';

interface FeedbackRequest {
  workflowId: string;
  feedbackType: 'works' | 'broken';
  difyVersion?: string;
  comment?: string;
}

// Get client IP from request
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  return '0.0.0.0';
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: FeedbackRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.workflowId || !body.feedbackType) {
      return NextResponse.json(
        { error: 'Missing required fields: workflowId and feedbackType' },
        { status: 400 }
      );
    }

    // Validate feedback type
    if (!['works', 'broken'].includes(body.feedbackType)) {
      return NextResponse.json(
        { error: 'Invalid feedbackType. Must be "works" or "broken"' },
        { status: 400 }
      );
    }

    // Validate comment length
    if (body.comment && body.comment.length > 500) {
      return NextResponse.json(
        { error: 'Comment too long. Maximum 500 characters' },
        { status: 400 }
      );
    }

    // Verify workflow exists
    const workflow = await getWorkflowById(body.workflowId);

    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // Get client IP (for basic rate limiting tracking, not stored in plain)
    const clientIp = getClientIp(request);

    // Insert feedback
    await insertWorkflowFeedback(body.workflowId, body.feedbackType, clientIp);

    // Update workflow counts (non-blocking)
    incrementFeedbackCount(body.workflowId, body.feedbackType).catch(() => {});

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json(
      {
        error: 'Feedback submission failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
