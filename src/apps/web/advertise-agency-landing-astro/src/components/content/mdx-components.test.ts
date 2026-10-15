// The MDX allowlist exposes the shared content stream renderer.
import { expect, it } from 'vitest';
import { mdxContentComponents } from './mdx-components';

it('registers ContentBlocks as the MDX component', () => {
  expect(mdxContentComponents.ContentBlocks).toBeDefined();
});
