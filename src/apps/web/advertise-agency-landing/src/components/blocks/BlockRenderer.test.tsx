import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('./HeadingBlock', () => ({ HeadingBlock: () => <div data-testid="heading-block" /> }));
vi.mock('./ParagraphBlock', () => ({
  ParagraphBlock: () => <div data-testid="paragraph-block" />,
}));
vi.mock('./ImageBlock', () => ({ ImageBlock: () => <div data-testid="image-block" /> }));
vi.mock('./GalleryBlock', () => ({ GalleryBlock: () => <div data-testid="gallery-block" /> }));
vi.mock('./BlockquoteBlock', () => ({
  BlockquoteBlock: () => <div data-testid="blockquote-block" />,
}));
vi.mock('./MetricsBlock', () => ({ MetricsBlock: () => <div data-testid="metrics-block" /> }));
vi.mock('./CardsBlock', () => ({ CardsBlock: () => <div data-testid="cards-block" /> }));
vi.mock('./TableBlock', () => ({ TableBlock: () => <div data-testid="table-block" /> }));
vi.mock('./ChartBlock', () => ({ ChartBlock: () => <div data-testid="chart-block" /> }));
vi.mock('./DividerBlock', () => ({ DividerBlock: () => <div data-testid="divider-block" /> }));
vi.mock('./CalloutBlock', () => ({ CalloutBlock: () => <div data-testid="callout-block" /> }));
vi.mock('./ListBlock', () => ({ ListBlock: () => <div data-testid="list-block" /> }));
vi.mock('./VideoBlock', () => ({ VideoBlock: () => <div data-testid="video-block" /> }));
vi.mock('./CodeBlock', () => ({ CodeBlock: () => <div data-testid="code-block" /> }));
vi.mock('./OrderFormBlock', () => ({
  OrderFormBlock: () => <div data-testid="order-form-block" />,
}));
vi.mock('@/components/error', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock('./BlockErrorFallback', () => ({ BlockErrorFallback: () => <div>error</div> }));

import { BlockRenderer } from './BlockRenderer';

const GRADIENT = 'from-blue-500 to-purple-500';
const TITLE = 'Test Case';

describe('BlockRenderer', () => {
  it('dispatches heading block', () => {
    render(
      <BlockRenderer
        block={{ __component: 'heading', level: 2, text: 'Hi' }}
        caseGradient={GRADIENT}
        caseTitle={TITLE}
      />
    );
    expect(screen.getByTestId('heading-block')).toBeInTheDocument();
  });

  it('dispatches paragraph block', () => {
    render(
      <BlockRenderer
        block={{ __component: 'paragraph', text: 'text' }}
        caseGradient={GRADIENT}
        caseTitle={TITLE}
      />
    );
    expect(screen.getByTestId('paragraph-block')).toBeInTheDocument();
  });

  it('dispatches image block', () => {
    render(
      <BlockRenderer
        block={{ __component: 'image', src: '/img.jpg', alt: 'alt' }}
        caseGradient={GRADIENT}
        caseTitle={TITLE}
      />
    );
    expect(screen.getByTestId('image-block')).toBeInTheDocument();
  });

  it('dispatches gallery block', () => {
    render(
      <BlockRenderer
        block={{ __component: 'gallery', images: [] }}
        caseGradient={GRADIENT}
        caseTitle={TITLE}
      />
    );
    expect(screen.getByTestId('gallery-block')).toBeInTheDocument();
  });

  it('dispatches blockquote block', () => {
    render(
      <BlockRenderer
        block={{ __component: 'blockquote', text: 'quote', author: 'A' }}
        caseGradient={GRADIENT}
        caseTitle={TITLE}
      />
    );
    expect(screen.getByTestId('blockquote-block')).toBeInTheDocument();
  });

  it('dispatches metrics block', () => {
    render(
      <BlockRenderer
        block={{ __component: 'metrics', items: [] }}
        caseGradient={GRADIENT}
        caseTitle={TITLE}
      />
    );
    expect(screen.getByTestId('metrics-block')).toBeInTheDocument();
  });

  it('dispatches cards block', () => {
    render(
      <BlockRenderer
        block={{ __component: 'cards', items: [] }}
        caseGradient={GRADIENT}
        caseTitle={TITLE}
      />
    );
    expect(screen.getByTestId('cards-block')).toBeInTheDocument();
  });

  it('dispatches table block', () => {
    render(
      <BlockRenderer
        block={{ __component: 'table', head: [], rows: [] }}
        caseGradient={GRADIENT}
        caseTitle={TITLE}
      />
    );
    expect(screen.getByTestId('table-block')).toBeInTheDocument();
  });

  it('dispatches chart block', () => {
    render(
      <BlockRenderer
        block={{ __component: 'chart', type: 'bar', items: [] }}
        caseGradient={GRADIENT}
        caseTitle={TITLE}
      />
    );
    expect(screen.getByTestId('chart-block')).toBeInTheDocument();
  });

  it('dispatches divider block', () => {
    render(
      <BlockRenderer block={{ __component: 'divider' }} caseGradient={GRADIENT} caseTitle={TITLE} />
    );
    expect(screen.getByTestId('divider-block')).toBeInTheDocument();
  });

  it('dispatches callout block', () => {
    render(
      <BlockRenderer
        block={{ __component: 'callout', type: 'info', text: 'note' }}
        caseGradient={GRADIENT}
        caseTitle={TITLE}
      />
    );
    expect(screen.getByTestId('callout-block')).toBeInTheDocument();
  });

  it('dispatches list block', () => {
    render(
      <BlockRenderer
        block={{ __component: 'list', style: 'unordered', items: [] }}
        caseGradient={GRADIENT}
        caseTitle={TITLE}
      />
    );
    expect(screen.getByTestId('list-block')).toBeInTheDocument();
  });

  it('dispatches video block', () => {
    render(
      <BlockRenderer
        block={{ __component: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }}
        caseGradient={GRADIENT}
        caseTitle={TITLE}
      />
    );
    expect(screen.getByTestId('video-block')).toBeInTheDocument();
  });

  it('dispatches code block', () => {
    render(
      <BlockRenderer
        block={{ __component: 'code', code: 'const x = 1;' }}
        caseGradient={GRADIENT}
        caseTitle={TITLE}
      />
    );
    expect(screen.getByTestId('code-block')).toBeInTheDocument();
  });

  it('dispatches order-form block', () => {
    render(
      <BlockRenderer
        block={{ __component: 'order-form', formId: 'consultation' }}
        caseGradient={GRADIENT}
        caseTitle={TITLE}
      />
    );
    expect(screen.getByTestId('order-form-block')).toBeInTheDocument();
  });

  it('returns null for unknown block type', () => {
    const unknownBlock = { __component: 'unknown-type' } as unknown as Parameters<
      typeof BlockRenderer
    >[0]['block'];
    const { container } = render(
      <BlockRenderer block={unknownBlock} caseGradient={GRADIENT} caseTitle={TITLE} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('applies py-8 spacing for default blocks', () => {
    const { container } = render(
      <BlockRenderer
        block={{ __component: 'paragraph', text: 'text' }}
        caseGradient={GRADIENT}
        caseTitle={TITLE}
      />
    );
    expect(container.firstChild).toHaveClass('py-8');
  });

  it('applies py-4 spacing for divider block', () => {
    const { container } = render(
      <BlockRenderer block={{ __component: 'divider' }} caseGradient={GRADIENT} caseTitle={TITLE} />
    );
    expect(container.firstChild).toHaveClass('py-4');
  });

  it('applies pt-6 pb-2 spacing for h3 heading block', () => {
    const { container } = render(
      <BlockRenderer
        block={{ __component: 'heading', level: 3, text: 'Sub' }}
        caseGradient={GRADIENT}
        caseTitle={TITLE}
      />
    );
    expect(container.firstChild).toHaveClass('pt-6', 'pb-2');
  });

  it('applies py-4 spacing for h2 heading block', () => {
    const { container } = render(
      <BlockRenderer
        block={{ __component: 'heading', level: 2, text: 'Title' }}
        caseGradient={GRADIENT}
        caseTitle={TITLE}
      />
    );
    expect(container.firstChild).toHaveClass('py-4');
  });
});
