import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/types/shared/iconMap', () => ({
  ICON_MAP: new Proxy(
    {},
    {
      get:
        () =>
        ({ size, className }: { size: number; className: string }) => (
          <svg data-testid="callout-icon" data-size={size} className={className} />
        ),
    }
  ),
}));

import { CalloutBlock } from './CalloutBlock';

describe('CalloutBlock', () => {
  it('renders info callout with text', () => {
    render(<CalloutBlock block={{ __component: 'callout', type: 'info', text: 'Info message' }} />);
    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('renders success callout with text', () => {
    render(<CalloutBlock block={{ __component: 'callout', type: 'success', text: 'Success!' }} />);
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  it('renders warning callout with text', () => {
    render(<CalloutBlock block={{ __component: 'callout', type: 'warning', text: 'Warning!' }} />);
    expect(screen.getByText('Warning!')).toBeInTheDocument();
  });

  it('renders note callout with text', () => {
    render(<CalloutBlock block={{ __component: 'callout', type: 'note', text: 'Note here' }} />);
    expect(screen.getByText('Note here')).toBeInTheDocument();
  });

  it('renders optional title when provided', () => {
    render(
      <CalloutBlock
        block={{ __component: 'callout', type: 'info', title: 'Important', text: 'Note' }}
      />
    );
    expect(screen.getByText('Important')).toBeInTheDocument();
  });

  it('renders icon from ICON_MAP', () => {
    render(<CalloutBlock block={{ __component: 'callout', type: 'info', text: 'test' }} />);
    expect(screen.getByTestId('callout-icon')).toBeInTheDocument();
  });

  it('applies info variant border class (blue)', () => {
    const { container } = render(
      <CalloutBlock block={{ __component: 'callout', type: 'info', text: 'test' }} />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('border-blue-400');
  });

  it('applies warning variant border class (amber)', () => {
    const { container } = render(
      <CalloutBlock block={{ __component: 'callout', type: 'warning', text: 'test' }} />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('border-amber-400');
  });

  it('renders decorative dots for success variant', () => {
    const { container } = render(
      <CalloutBlock block={{ __component: 'callout', type: 'success', text: 'test' }} />
    );
    const dots = container.querySelectorAll('[aria-hidden="true"]');
    expect(dots.length).toBeGreaterThanOrEqual(3);
  });
});
