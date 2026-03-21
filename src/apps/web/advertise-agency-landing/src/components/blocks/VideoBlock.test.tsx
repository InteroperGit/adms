import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VideoBlock } from './VideoBlock';

describe('VideoBlock', () => {
  describe('YouTube video', () => {
    const ytBlock = {
      __component: 'video' as const,
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      caption: 'Rick Roll',
    };

    it('renders facade button before click', () => {
      render(<VideoBlock block={ytBlock} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.queryByTitle('Rick Roll')).not.toBeInTheDocument();
    });

    it('renders iframe after clicking play button', () => {
      render(<VideoBlock block={ytBlock} />);
      fireEvent.click(screen.getByRole('button'));
      const iframe = screen.getByTitle('Rick Roll');
      expect(iframe.tagName).toBe('IFRAME');
      expect(iframe).toHaveAttribute('src', expect.stringContaining('youtube.com/embed'));
    });

    it('renders caption', () => {
      render(<VideoBlock block={ytBlock} />);
      expect(screen.getByText('Rick Roll')).toBeInTheDocument();
    });
  });

  describe('Rutube video', () => {
    const rtBlock = {
      __component: 'video' as const,
      url: 'https://rutube.ru/video/abc123def456/',
    };

    it('renders facade button before click', () => {
      render(<VideoBlock block={rtBlock} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders iframe after clicking play button', () => {
      render(<VideoBlock block={rtBlock} />);
      fireEvent.click(screen.getByRole('button'));
      const iframe = screen.getByTitle('Video');
      expect(iframe.tagName).toBe('IFRAME');
      expect(iframe).toHaveAttribute('src', expect.stringContaining('rutube.ru/play/embed'));
    });
  });

  describe('local video file', () => {
    const localBlock = {
      __component: 'video' as const,
      url: '/videos/promo.mp4',
    };

    it('renders video element directly without facade', () => {
      const { container } = render(<VideoBlock block={localBlock} />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(container.querySelector('video')).toBeInTheDocument();
      expect(container.querySelector('video')).toHaveAttribute('src', '/videos/promo.mp4');
    });
  });
});
