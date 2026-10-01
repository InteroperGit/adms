import type { z } from 'astro/zod';
import type { projectSchema } from '@/content/schemas';

export type Project = z.infer<typeof projectSchema>;
