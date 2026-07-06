import { z } from 'zod';

export const urlSchema = z.object({
  originalUrl: z
    .string()
    .min(1, 'URL is required')
    .max(2048, 'URL is too long')
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
