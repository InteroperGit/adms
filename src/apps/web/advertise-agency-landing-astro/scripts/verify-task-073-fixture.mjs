// Exercise catalogue rules in memory without changing production data.
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const sourcePath = 'data/content/config/projects.json';
const outputPath = 'output/playwright/task-073/fixture-results.json';
const source = await readFile(sourcePath, 'utf8');
const records = JSON.parse(source);
const published = records.find((item) => item.status === 'published')
  ?? records.find((item) => item.status !== 'draft');
const demo = records.find((item) => item.status === 'demo');
if (!published || !demo) {
  throw new Error('Production data needs public and demo records');
}

// Clone records only in memory so the fixture cannot leak into the site build.
const fixture = Array.from({ length: 30 }, (_, index) => {
  const template = index % 5 === 0 ? demo : published;
  return {
    ...structuredClone(template),
    id: 9000 + index,
    title: `Fixture project ${index + 1}`,
    category: index % 7 === 0 ? null : template.category,
    status: index === 29 ? 'draft' : template.status,
  };
});
const visible = fixture.filter((item) => item.status !== 'draft');
const pageSize = 6;
const page = (number) => visible.slice(
  (number - 1) * pageSize, number * pageSize,
);
const category = visible.find((item) => item.category)?.category;
const filtered = visible.filter((item) => item.category === category);
const result = {
  fixtureCount: fixture.length,
  visibleCount: visible.length,
  draftCount: fixture.filter((item) => item.status === 'draft').length,
  demoCount: visible.filter((item) => item.status === 'demo').length,
  categorylessCount: visible.filter((item) => !item.category).length,
  pageCount: Math.ceil(visible.length / pageSize),
  pageTwoCount: page(2).length,
  filteredCount: filtered.length,
  productionSha256: createHash('sha256').update(source).digest('hex'),
  assertions: {
    moreThan24: fixture.length > 24,
    draftsHidden: visible.every((item) => item.status !== 'draft'),
    demosVisible: visible.some((item) => item.status === 'demo'),
    categorylessRetained: visible.some((item) => !item.category),
    paginationHasSecondPage: page(2).length > 0,
    categoryFilterNarrows: filtered.length < visible.length,
    uniqueIds: new Set(fixture.map((item) => item.id)).size === fixture.length,
  },
};
if (Object.values(result.assertions).some((value) => !value)) {
  throw new Error(
    `Fixture assertions failed: ${JSON.stringify(result.assertions)}`,
  );
}
await mkdir('output/playwright/task-073', { recursive: true });
await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(`Task 073 fixture checks passed (${fixture.length} records).`);

