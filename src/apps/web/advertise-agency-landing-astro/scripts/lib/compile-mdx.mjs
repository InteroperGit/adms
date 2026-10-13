// Exercise the real restricted MDX processor and generated component mapping.
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  markdownConfigDefaults, parseFrontmatter, unified,
} from '@astrojs/markdown-remark';
import remarkContentBlocks from '../../src/content/mdx-blocks.mjs';

const processor = unified({
  remarkPlugins: [remarkContentBlocks], smartypants: false,
});
const renderer = await processor.createMdxRenderer(markdownConfigDefaults, {
  srcDir: pathToFileURL(resolve('src') + '/'),
});

export async function compileMdx(source, path = 'fixture.mdx') {
  const { frontmatter, content } = parseFrontmatter(source);
  const metadata = structuredClone(frontmatter);
  const result = await renderer.process(content, resolve(path), frontmatter);
  const code = result.code.replaceAll(
    '"astro/jsx-runtime"', JSON.stringify(import.meta.resolve(
      'astro/jsx-runtime',
    )),
  );
  const generated = await import(`data:text/javascript;base64,${Buffer
    .from(code).toString('base64')}`);
  const component = () => null;
  const context = { kind: 'project', projectId: 1, published: false };
  // Inspect the generated component call to prove MDX passes normalized blocks
  // and page-owned context, rather than interpreting authored expressions.
  const rendered = generated.default({
    components: { ContentBlocks: component },
    context,
  });
  assert.equal(rendered.type, component);
  assert.deepEqual(rendered.props.blocks, generated.frontmatter.content);
  assert.deepEqual(rendered.props.context, context);
  return { frontmatter: metadata, content: generated.frontmatter.content };
}
