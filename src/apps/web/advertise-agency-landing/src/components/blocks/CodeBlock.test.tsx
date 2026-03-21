import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const writeTextMock = vi.fn().mockResolvedValue(undefined);

beforeEach(() => {
  Object.defineProperty(navigator, 'clipboard', {
    writable: true,
    configurable: true,
    value: { writeText: writeTextMock },
  });
  writeTextMock.mockClear();
});

import { CodeBlock } from './CodeBlock';

describe('CodeBlock', () => {
  const baseBlock = {
    __component: 'code' as const,
    code: 'const x = 1;\nconst y = 2;',
    language: 'javascript',
  };

  it('renders code content', () => {
    const { container } = render(<CodeBlock block={baseBlock} />);
    expect(container.querySelector('pre')).toBeInTheDocument();
    expect(container.querySelector('code')).toBeInTheDocument();
  });

  it('renders language badge', () => {
    render(<CodeBlock block={baseBlock} />);
    expect(screen.getByText('javascript')).toBeInTheDocument();
  });

  it('shows default language badge when language not specified', () => {
    render(<CodeBlock block={{ __component: 'code', code: 'hello()' }} />);
    expect(screen.getByText('code')).toBeInTheDocument();
  });

  it('renders copy button', () => {
    render(<CodeBlock block={baseBlock} />);
    expect(screen.getByRole('button', { name: /Скопировать код/i })).toBeInTheDocument();
  });

  it('copy button writes to clipboard', async () => {
    render(<CodeBlock block={baseBlock} />);
    fireEvent.click(screen.getByRole('button', { name: /Скопировать код/i }));
    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith(baseBlock.code);
    });
  });

  it('shows copied feedback after clicking copy', async () => {
    render(<CodeBlock block={baseBlock} />);
    fireEvent.click(screen.getByRole('button', { name: /Скопировать код/i }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Скопировано/i })).toBeInTheDocument();
    });
  });

  it('renders line numbers when showLineNumbers is true', () => {
    const { container } = render(<CodeBlock block={{ ...baseBlock, showLineNumbers: true }} />);
    // Line numbers: 1, 2 for 2-line code
    expect(container.querySelector('span[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('renders caption when provided', () => {
    render(<CodeBlock block={{ ...baseBlock, caption: 'Example code' }} />);
    expect(screen.getByText('Example code')).toBeInTheDocument();
  });

  it('applies JSON syntax highlighting for json language', () => {
    const { container } = render(
      <CodeBlock block={{ __component: 'code', code: '{"key": "value"}', language: 'json' }} />
    );
    // JSON highlighting creates colored spans
    const spans = container.querySelectorAll('span.text-sky-300, span.text-emerald-300');
    expect(spans.length).toBeGreaterThan(0);
  });
});
