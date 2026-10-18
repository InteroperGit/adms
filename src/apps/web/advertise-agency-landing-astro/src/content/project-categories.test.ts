// Registry validation runs against isolated, versioned category data.
import { afterEach, expect, it, vi } from 'vitest';
import fixture from '../../tests/fixtures/content/project-categories.json';
import { getProjectCategory, projectCategories } from './project-categories';

afterEach(() => {
  vi.doUnmock('@/data/content/config/project-categories.json');
  vi.resetModules();
});

it('looks up exact configured categories and ignores missing or unknown IDs',
  () => {
    expect(projectCategories).toEqual(fixture);
    expect(getProjectCategory(fixture[0].slug)).toBe(projectCategories[0]);
    for (const slug of [undefined, null, '', 'unknown', 'SAMPLE', ' sample']) {
      expect(getProjectCategory(slug)).toBeUndefined();
    }
  },
);

it.each([
  [], [fixture[0], fixture[0]],
  [{ ...fixture[0], slug: 'Bad slug' }],
  [{ ...fixture[0], label: '' }],
  [{ ...fixture[0], color: '#fff' }],
  [{ ...fixture[0], textColor: 'red' }],
  [{ ...fixture[0], unknown: true }],
].map(data => ({ data })))(
  'rejects invalid registry data: $data', async ({ data }) => {
    vi.resetModules();
    vi.doMock('@/data/content/config/project-categories.json', () => ({
      default: data,
    }));
    await expect(import('./project-categories')).rejects.toThrow();
  },
);

it('reports duplicate slugs at the offending registry index', async () => {
  vi.resetModules();
  vi.doMock('@/data/content/config/project-categories.json', () => ({
    default: [fixture[0], fixture[0]],
  }));
  await expect(import('./project-categories')).rejects.toMatchObject({
    issues: expect.arrayContaining([expect.objectContaining({
      path: [1, 'slug'], message: 'Category slugs must be unique',
    })]),
  });
});
