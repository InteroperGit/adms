// Visible demos have public destinations but cannot enter the indexable map.
import { expect, it } from 'vitest';
import { buildProject } from '../../tests/helpers/fixtures';
import { projectCategories } from './project-categories';
import {
  getAvailableProjectCategories, getPublishedProjectPaths,
  getVisibleProjects, isProjectPublished,
} from './project-publication';

it('separates draft, demo, published and nested demo projects', () => {
  const published = buildProject({ id: 1, status: 'published', content: [] });
  const draft = buildProject({ id: 2, status: 'draft' });
  const demo = buildProject({ id: 3, status: 'demo' });
  const nestedDemo = buildProject({ id: 4, status: 'published', content: [
    { type: 'paragraph', paragraphs: ['Demo'], status: 'demo' },
  ] });
  const records = [draft, demo, published, nestedDemo];
  expect(records.map(isProjectPublished)).toEqual([false, false, true, false]);
  expect(getVisibleProjects(records)).toEqual([demo, published, nestedDemo]);
  expect(getPublishedProjectPaths(records)).toEqual(['/projects/1/']);
  expect(getVisibleProjects([])).toEqual([]);
  expect(getPublishedProjectPaths([])).toEqual([]);
});

it('returns represented categories without assigning a fallback', () => {
  const category = projectCategories[0];
  const classified = buildProject({ category: category.slug });
  const unclassified = buildProject({ category: undefined });
  expect(getAvailableProjectCategories([])).toEqual([]);
  expect(getAvailableProjectCategories([unclassified])).toEqual([]);
  expect(getAvailableProjectCategories([
    classified, unclassified, classified,
  ])).toEqual([category]);
});
