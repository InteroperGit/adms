// Shared builders for stable, schema-shaped test data.
import contracts from '../fixtures/content/unit-contracts.json';
import blocks from '../fixtures/content/content-blocks.json';
import type { ContentBlock } from '../../src/types/content-blocks';
import type { Project } from '../../src/types/project';

type JsonValue = string | number | boolean | null | JsonValue[] |
  { [key: string]: JsonValue };

/** Clone JSON fixtures so a test can mutate its copy safely. */
export function cloneFixture<T>(value: T): T {
  return structuredClone(value);
}

/** Apply shallow overrides to a cloned fixture without sharing nested data. */
export function buildFixture<T extends object>(
  value: T,
  overrides: Partial<T> = {},
): T {
  return { ...cloneFixture(value), ...cloneFixture(overrides) };
}

/** Return the complete contract fixture for a named content domain. */
export function buildContract<K extends keyof typeof contracts>(
  name: K,
  overrides: Partial<(typeof contracts)[K]> = {},
): (typeof contracts)[K] {
  return buildFixture(contracts[name], overrides);
}

/** Return content blocks that can be passed directly to block components. */
export function buildContentBlocks(
  overrides: Partial<ContentBlock>[] = [],
): ContentBlock[] {
  const source = cloneFixture(blocks) as ContentBlock[];
  return source.map((block, index) => ({
    ...block,
    ...overrides[index],
  })) as ContentBlock[];
}

/** Build a minimal project article for catalog and article tests. */
export function buildProject(overrides: Partial<Project> = {}): Project {
  const source = contracts.project as unknown as Project;
  return buildFixture(source, {
    content: buildContentBlocks([{ type: 'paragraph' }]),
    ...overrides,
  });
}

/** Build a plain JSON value when a test needs an isolated arbitrary fixture. */
export function jsonFixture<T extends JsonValue>(value: T): T {
  return cloneFixture(value);
}
