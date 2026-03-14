import { z } from 'zod';

/**
 * @module blocks/video
 * @description Embedded video block (YouTube, Vimeo, etc.)
 */

export const VideoBlockSchema = z.object({
  __component: z.literal('video'),
  /** Video URL (supports YouTube, Vimeo embed URLs) */
  url: z.string(),
  /** Optional video caption */
  caption: z.string().optional(),
  /** Optional aspect ratio (e.g., "16/9", "4/3") */
  aspectRatio: z.string().optional(),
});

export type VideoBlock = z.infer<typeof VideoBlockSchema>;
