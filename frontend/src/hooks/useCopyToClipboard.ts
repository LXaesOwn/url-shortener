import { useState, useCallback } from 'react';

export const useCopyToClipboard = (timeoutMs: number = 2000) => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(null);
      setTimeout(() => setCopied(false), timeoutMs);
    } catch (err) {
      setError('Failed to copy');
      setCopied(false);
    }
  }, [timeoutMs]);

  return { copy, copied, error };
};
