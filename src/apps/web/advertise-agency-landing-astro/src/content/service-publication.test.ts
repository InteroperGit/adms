// Cards and articles share approvals, with stricter article indexing gates.
import { expect, it } from 'vitest';
import { buildContract } from '../../tests/helpers/fixtures';
import { createServicesSchema } from '../validation/services';
import {
  getPublishedServicePaths, getVisibleServices, isServiceArticlePublished,
  isServicePublished,
} from './service-publication';

function approvedContent() {
  const schema = createServicesSchema(['/services/sample/']);
  const content = schema.parse(buildContract('services'));
  content.copyApproved = true;
  const service = content.items[0];
  service.confirmed = true;
  service.copyApproved = true;
  service.image!.approved = true;
  service.article.approved = true;
  return content;
}

it('requires every card approval and permits explicit preview', () => {
  for (const gate of ['section', 'confirmed', 'copy', 'image', 'missing']) {
    const content = approvedContent();
    const service = content.items[0];
    if (gate === 'section') content.copyApproved = false;
    if (gate === 'confirmed') service.confirmed = false;
    if (gate === 'copy') service.copyApproved = false;
    if (gate === 'image') service.image!.approved = false;
    if (gate === 'missing') service.image = null;
    expect(isServicePublished(content, service)).toBe(false);
    expect(getVisibleServices(content)).toEqual([]);
    expect(getPublishedServicePaths(content)).toEqual([]);
    content.demoMode = true;
    expect(getVisibleServices(content)).toBe(content.items);
  }
});

it('requires approved nonempty visible non-demo article content and a route',
  () => {
    const content = approvedContent();
    const service = content.items[0];
    expect(isServiceArticlePublished(content, service)).toBe(true);
    expect(getVisibleServices(content)).toEqual([service]);
    expect(getPublishedServicePaths(content)).toEqual([service.href]);
    service.href = undefined;
    expect(getPublishedServicePaths(content)).toEqual([]);
    service.article.approved = false;
    expect(isServiceArticlePublished(content, service)).toBe(false);
    service.article.approved = true;
    service.article.content = [];
    expect(isServiceArticlePublished(content, service)).toBe(false);
    service.article.content = [
      { type: 'paragraph', paragraphs: ['Hidden'], status: 'draft' },
    ];
    expect(isServiceArticlePublished(content, service)).toBe(false);
    service.article.content[0].status = 'demo';
    expect(isServiceArticlePublished(content, service)).toBe(false);
    service.article.content[0].status = 'published';
    content.demoMode = true;
    expect(isServiceArticlePublished(content, service)).toBe(false);
    content.items = [];
    expect(getPublishedServicePaths(content)).toEqual([]);
    expect(getVisibleServices(content)).toEqual([]);
  },
);
