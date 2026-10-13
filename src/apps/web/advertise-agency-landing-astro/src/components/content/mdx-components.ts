// One mapping feeds normalized MDX through the existing JSON block renderer.
// Individual authored components are validated by the compiler allowlist.
import ContentBlocks from './ContentBlocks.astro';

export const mdxContentComponents = { ContentBlocks };
