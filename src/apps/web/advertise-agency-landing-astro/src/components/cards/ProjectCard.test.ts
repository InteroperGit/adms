// @vitest-environment node
import { expect, it } from 'vitest';
import { getByRole } from '@testing-library/dom';
import ProjectCard from './ProjectCard.astro';
import type { Project } from '../../../src/types/project';
import type { ImageBlock } from '../../../src/types/content-blocks';
import { render } from '../../../tests/helpers/render';

const image: ImageBlock = {
  type: 'image', src: '/test-project.webp', alt: 'Installed sign',
  width: 800, height: 600,
};
const project = (): Project => ({
  id: 42, status: 'demo', notice: null, title: 'Sample project',
  client: 'Sample client', attribution: 'generic', description: 'Summary',
  category: 'sample', content: [],
});

it('renders text-only copy, category and named detail action', async () => {
  const body = await render(ProjectCard, { project: project() });
  expect(getByRole(body, 'article')).toBeInTheDocument();
  expect(getByRole(body, 'heading', { level: 3 }))
    .toHaveTextContent('Sample project');
  const link = getByRole(body, 'link', { name: 'Подробнее: Sample project' });
  expect(link).toHaveAttribute('href', '/projects/42/');
  expect(link).toHaveAttribute('data-project-link');
  expect(link.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  expect(body.querySelector('.project-category')).toHaveTextContent('Sample');
  expect(body.querySelector('.project-client'))
    .toHaveTextContent(/^Sample client$/);
  expect(body).toHaveTextContent('Summary');
  expect(body.querySelector('img, .content-media-frame')).toBeNull();
});

it('selects the first visible image after drafts and empty galleries',
  async () => {
    const item = project();
    item.date = '2026-10-15';
    item.category = null;
    item.content = [
      { ...image, status: 'draft', src: '/hidden.webp' },
      { type: 'image-gallery', images: [{ ...image, status: 'draft' }] },
      { type: 'paragraph', paragraphs: ['Copy'] },
      image, { ...image, src: '/later.webp' },
    ];
    const body = await render(ProjectCard, { project: item });
    const photo = getByRole(body, 'img', { name: image.alt });
    expect(photo).toHaveAttribute('src', image.src);
    expect(photo).toHaveAttribute('width', '800');
    expect(photo).toHaveAttribute('height', '600');
    expect(photo).toHaveAttribute('loading', 'lazy');
    expect(photo.parentElement).toHaveClass('content-media-thumbnail');
    expect(photo.parentElement).toHaveAttribute('data-image-state', 'loading');
    expect(body.querySelectorAll('img')).toHaveLength(1);
    expect(body.querySelector('.project-category')).toBeNull();
    expect(body.querySelector('.project-client'))
      .toHaveTextContent('Sample client, 2026-10-15');
  },
);

it('uses the first nondraft gallery image before a later standalone image',
  async () => {
    const item = project();
    item.content = [{ type: 'image-gallery', images: [
      { ...image, status: 'draft' },
      { ...image, src: '/gallery.webp', status: 'demo' },
    ] }, image];
    const body = await render(ProjectCard, { project: item });
    expect(getByRole(body, 'img')).toHaveAttribute('src', '/gallery.webp');
  },
);

it('omits media when every supplied image is a draft', async () => {
  const item = project();
  item.content = [{ ...image, status: 'draft' }];
  const body = await render(ProjectCard, { project: item });
  expect(body.querySelector('img, .content-media-frame')).toBeNull();
  expect(getByRole(body, 'link')).toHaveAttribute('href', '/projects/42/');
});

it('escapes project copy while keeping the stable detail URL', async () => {
  const item = project();
  item.title = '<script>unsafe()</script>';
  item.client = '<b>unsafe client</b>';
  item.description = '<i>unsafe summary</i>';
  const body = await render(ProjectCard, { project: item });
  expect(body.querySelector('script, b, i')).toBeNull();
  expect(body).toHaveTextContent(item.title);
  expect(body).toHaveTextContent(item.client);
  expect(body).toHaveTextContent(item.description);
  expect(getByRole(body, 'link')).toHaveAttribute('href', '/projects/42/');
});
