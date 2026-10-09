// Check editorial gates with synthetic approvals, never changing live JSON.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

// Pure helpers contain only type imports; transpile for minimum Node 22.
async function loadHelper(path) {
  const source = await readFile(path, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ES2022,
    },
  }).outputText;
  return import(
    `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
  );
}

const {
  getVisibleServices,
  isServiceArticlePublished,
  getPublishedServicePaths,
} = await loadHelper('src/content/service-publication.ts');
const { getVisibleIntroductionPhoto } = await loadHelper(
  'src/content/introduction-publication.ts',
);
// Fixtures stay independent of valid editorial changes such as null images.
function approvedImage() {
  return {
    src: '/images/synthetic-photo.webp',
    alt: 'Synthetic fixture image',
    width: 1200,
    height: 900,
    source: 'Synthetic source for tests only',
    projectContext: 'Synthetic installation for tests only',
    publicationPermission: 'Synthetic permission for tests only',
    approved: true,
    desktopFocalPoint: { x: 50, y: 50 },
    mobileFocalPoint: { x: 50, y: 50 },
  };
}

function approvedService(id) {
  return {
    id,
    name: 'Synthetic service',
    description: 'Synthetic service description',
    claimSource: 'Synthetic confirmation for tests only',
    confirmed: true,
    copyApproved: true,
    image: approvedImage(),
    href: `/services/${id}/`,
    article: {
      title: 'Synthetic article',
      description: 'Synthetic article description',
      lead: 'Synthetic article lead',
      sections: [{ heading: 'Synthetic heading', paragraphs: ['Test copy'] }],
      inquiry: ['Synthetic inquiry input'],
      approved: true,
    },
  };
}

function approvedCatalog() {
  return {
    demoMode: false,
    demoNotice: 'Synthetic demonstration notice',
    heading: 'Synthetic catalog',
    introduction: 'Synthetic catalog introduction',
    copyApproved: true,
    items: [approvedService('first'), approvedService('second')],
  };
}

test('each approval can independently withhold cards and article indexing',
  () => {
    const ready = approvedCatalog();
    assert.equal(getVisibleServices(ready).length, ready.items.length);
    assert.deepEqual(getPublishedServicePaths(ready),
      ready.items.map(service => service.href));

    for (const field of ['confirmed', 'copyApproved', 'image', 'article']) {
      const fixture = approvedCatalog();
      const service = fixture.items[0];
      if (field === 'image' || field === 'article') {
        service[field].approved = false;
      } else {
        service[field] = false;
      }
      assert.equal(isServiceArticlePublished(fixture, service), false, field);
      assert.ok(!getPublishedServicePaths(fixture).includes(service.href));
      assert.equal(getVisibleServices(fixture).includes(service),
        field === 'article', field);
    }

    ready.copyApproved = false;
    assert.deepEqual(getVisibleServices(ready), []);
    assert.deepEqual(getPublishedServicePaths(ready), []);
    ready.items.forEach(service => {
      assert.equal(isServiceArticlePublished(ready, service), false);
    });
  });

test('demo visibility never overrides article indexing or route existence',
  () => {
    const fixture = approvedCatalog();
    fixture.demoMode = true;
    assert.equal(getVisibleServices(fixture).length, fixture.items.length);
    assert.deepEqual(getPublishedServicePaths(fixture), []);
    fixture.demoMode = false;
    fixture.items[0].image = null;
    assert.ok(!getVisibleServices(fixture).includes(fixture.items[0]));
    assert.equal(isServiceArticlePublished(fixture, fixture.items[0]), false);
    const unlinked = fixture.items[1];
    delete unlinked.href;
    assert.ok(getVisibleServices(fixture).includes(unlinked));
    assert.deepEqual(getPublishedServicePaths(fixture), []);
    fixture.items = [];
    assert.deepEqual(getVisibleServices(fixture), []);
    assert.deepEqual(getPublishedServicePaths(fixture), []);
  });

test('hero approval, explicit demo visibility and missing media are safe',
  () => {
    const photo = approvedImage();
    const fixture = {
      heading: 'Synthetic introduction',
      summary: 'Synthetic summary',
      location: 'Synthetic location',
      copyApproved: true,
      demoMode: false,
      action: { label: 'Discuss', href: '/#order-inquiry' },
      photo,
    };
    assert.equal(getVisibleIntroductionPhoto(fixture), photo);
    fixture.copyApproved = false;
    assert.equal(getVisibleIntroductionPhoto(fixture), null);
    fixture.copyApproved = true;
    photo.approved = false;
    assert.equal(getVisibleIntroductionPhoto(fixture), null);
    fixture.demoMode = true;
    assert.equal(getVisibleIntroductionPhoto(fixture), photo);
    assert.equal(photo.approved, false);
    fixture.photo = null;
    assert.equal(getVisibleIntroductionPhoto(fixture), null);
  });
