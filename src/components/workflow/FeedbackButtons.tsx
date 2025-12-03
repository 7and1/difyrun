'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FeedbackButtonsProps {
  workflowId: string;
}

export function FeedbackButtons({ workflowId }: FeedbackButtonsProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<'works' | 'broken' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFeedback = async (type: 'works' | 'broken') => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflowId,
          feedbackType: type,
        }),
      });

      const data = await response.json() as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      setSubmitted(type);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-4 bg-muted/50 rounded-lg text-center">
        <p className="text-sm text-muted-foreground">
          {submitted === 'works'
            ? "Thanks! We're glad it works for you."
            : "Thanks for letting us know. We'll look into it."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Did this workflow work for you?
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => handleFeedback('works')}
          disabled={submitting}
          className={cn(
            'flex-1 hover:bg-green-50 hover:text-green-600 hover:border-green-200',
            'dark:hover:bg-green-950/30'
          )}
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <ThumbsUp className="h-4 w-4 mr-2" />
              Works
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => handleFeedback('broken')}
          disabled={submitting}
          className={cn(
            'flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-200',
            'dark:hover:bg-red-950/30'
          )}
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <ThumbsDown className="h-4 w-4 mr-2" />
              Broken
            </>
          )}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
