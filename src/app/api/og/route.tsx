// Dynamic Open Graph image generation

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const title = searchParams.get('title') || 'Dify Workflow Template';
    const nodes = searchParams.get('nodes') || '0';
    const category = searchParams.get('category') || 'Workflow';
    const downloads = searchParams.get('downloads') || '0';

    // Category colors
    const categoryColors: Record<string, string> = {
      'MCP Server': '#8b5cf6',
      'AI Agents': '#3b82f6',
      'RAG Pipelines': '#22c55e',
      'Chatbots': '#06b6d4',
      'Content Creation': '#f97316',
      'Translation': '#ec4899',
      'Data Analysis': '#6366f1',
      'Automation': '#eab308',
      'Development': '#64748b',
      'Workflow': '#3b82f6',
    };

    const categoryColor = categoryColors[category] || '#3b82f6';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
            padding: '60px 80px',
          }}
        >
          {/* Background pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Top badge */}
          <div
            style={{
              position: 'absolute',
              top: 60,
              left: 80,
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: '#60a5fa',
                letterSpacing: '-0.02em',
              }}
            >
              DifyRun
            </div>
            <div
              style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '999px',
                padding: '8px 20px',
                fontSize: 18,
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              Free DSL Download
            </div>
          </div>

          {/* Category badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                background: categoryColor,
                borderRadius: '999px',
                padding: '10px 24px',
                fontSize: 20,
                fontWeight: 600,
                color: 'white',
              }}
            >
              {category}
            </div>
            <div
              style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '999px',
                padding: '10px 24px',
                fontSize: 20,
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              {nodes} nodes
            </div>
            {parseInt(downloads) > 0 && (
              <div
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '999px',
                  padding: '10px 24px',
                  fontSize: 20,
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                {downloads} downloads
              </div>
            )}
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 40 ? 48 : 64,
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.2,
              marginBottom: '32px',
              maxWidth: '1000px',
              letterSpacing: '-0.02em',
            }}
          >
            {title.length > 60 ? title.substring(0, 57) + '...' : title}
          </div>

          {/* Bottom info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px',
              color: 'rgba(255,255,255,0.6)',
              fontSize: 24,
            }}
          >
            <span>difyrun.com</span>
            <span>|</span>
            <span>Compatible with Dify v1.6+</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG image generation error:', error);

    // Return a fallback image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: 'white',
            }}
          >
            DifyRun
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
