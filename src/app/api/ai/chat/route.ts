// AI Chat API Route - OpenRouter Integration
// All API keys are stored server-side only (never exposed to client)

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { SYSTEM_PROMPT, getFallbackResponse } from '@/lib/ai/prompts';

// Request schema validation
const chatSchema = z.object({
  prompt: z.string().min(1).max(2000),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional(),
});

// OpenRouter API configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'deepseek/deepseek-chat-v3-0324:free';

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const parsed = chatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { prompt, conversationHistory = [] } = parsed.data;

    // Get API key from environment (server-side only)
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;

    // If no API key, use fallback responses
    if (!apiKey) {
      console.log('[AI_CHAT] No API key configured, using fallback');
      return NextResponse.json({
        success: true,
        message: {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: getFallbackResponse(prompt),
        },
        meta: { fallback: true },
      });
    }

    // Build messages array for OpenRouter
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-6), // Keep last 6 messages for context
      { role: 'user', content: prompt },
    ];

    // Call OpenRouter API
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://difyrun.com',
        'X-Title': 'DifyRun AI Advisor',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[AI_CHAT] OpenRouter error:', response.status, errorText);

      // Fallback on API error
      return NextResponse.json({
        success: true,
        message: {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: getFallbackResponse(prompt),
        },
        meta: { fallback: true, reason: 'api_error' },
      });
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || getFallbackResponse(prompt);

    // Clean up any model-specific tokens
    content = content
      .replace(/<\|begin_of_sentence\|>/g, '')
      .replace(/<\|end_of_sentence\|>/g, '')
      .replace(/<\|.*?\|>/g, '')
      .trim();

    return NextResponse.json({
      success: true,
      message: {
        id: crypto.randomUUID(),
        role: 'assistant',
        content,
      },
    });

  } catch (error) {
    console.error('[AI_CHAT] Error:', error);

    // Always return a helpful response, even on error
    return NextResponse.json({
      success: true,
      message: {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Here's a quick tip: To import a workflow, download the DSL file from any template page and upload it to your Dify Studio!",
      },
      meta: { fallback: true, reason: 'exception' },
    });
  }
}

// Health check endpoint
export async function GET() {
  const hasApiKey = !!process.env.OPENROUTER_API_KEY;

  return NextResponse.json({
    status: 'ok',
    model: process.env.OPENROUTER_MODEL || DEFAULT_MODEL,
    mode: hasApiKey ? 'live' : 'fallback',
  });
}
