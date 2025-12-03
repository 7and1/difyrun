'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DslCodeBlockProps {
  code: string;
  filename: string;
  className?: string;
}

export function DslCodeBlock({ code, filename, className }: DslCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'application/x-yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Truncate code for display (show first 100 lines)
  const lines = code.split('\n');
  const displayCode = lines.length > 100
    ? lines.slice(0, 100).join('\n') + '\n\n# ... truncated ...'
    : code;

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <span className="text-sm text-slate-400 font-mono">{filename}</span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 text-slate-400 hover:text-white hover:bg-slate-700"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1 text-green-400" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-8 text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </div>

      {/* Code */}
      <div className="max-h-[500px] overflow-auto">
        <SyntaxHighlighter
          language="yaml"
          style={oneDark}
          showLineNumbers
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: '13px',
          }}
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1em',
            color: '#6b7280',
            textAlign: 'right',
          }}
        >
          {displayCode}
        </SyntaxHighlighter>
      </div>

      {/* Truncation notice */}
      {lines.length > 100 && (
        <div className="px-4 py-2 bg-slate-800 border-t border-slate-700 text-sm text-slate-400">
          Showing first 100 lines of {lines.length} total. Download the file to see the full content.
        </div>
      )}
    </div>
  );
}
