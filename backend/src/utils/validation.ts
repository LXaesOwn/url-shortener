import { z } from 'zod';

const normalizeUrl = (url: string): string => {
  const trimmed = url.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

export const urlSchema = z.object({
  originalUrl: z
    .string()
    .min(1, 'URL is required')
    .max(2048, 'URL is too long')
    .transform(normalizeUrl)
    .refine(
      (url) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      },
      { message: 'Invalid URL format' }
    ),
});

export type UrlInput = z.infer<typeof urlSchema>;