// @vitest-environment node
// Video blocks keep native controls and transcript content available.
import { expect, it } from 'vitest';
import VideoBlock from './VideoBlock.astro';
import { render } from '../../../tests/helpers/render';

it('renders native video metadata and an optional transcript', async () => {
  const body = await render(VideoBlock, { block: {
    type: 'video', src: '/fixture.mp4', alt: 'Fixture video', width: 16,
    height: 9, caption: 'Caption', transcript: 'Transcript',
  } });
  expect(body.querySelector('video')).toHaveAttribute('controls');
  expect(body.querySelector('source')).toHaveAttribute('type', 'video/mp4');
  expect(body.querySelector('figcaption')).toHaveTextContent('Caption');
  expect(body.querySelector('.video-transcript'))
    .toHaveTextContent('Transcript');
});
