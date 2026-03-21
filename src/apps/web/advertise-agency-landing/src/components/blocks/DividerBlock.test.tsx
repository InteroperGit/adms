import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DividerBlock } from './DividerBlock';

describe('DividerBlock', () => {
  it('renders hr for default line style', () => {
    const { container } = render(<DividerBlock block={{ __component: 'divider' }} />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('renders hr for explicit line style', () => {
    const { container } = render(
      <DividerBlock block={{ __component: 'divider', style: 'line' }} />
    );
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('renders three dots for dots style', () => {
    const { container } = render(
      <DividerBlock block={{ __component: 'divider', style: 'dots' }} />
    );
    expect(container.querySelector('hr')).not.toBeInTheDocument();
    const dots = container.querySelectorAll('span');
    expect(dots).toHaveLength(3);
  });

  it('renders space div for space style', () => {
    const { container } = render(
      <DividerBlock block={{ __component: 'divider', style: 'space' }} />
    );
    expect(container.querySelector('hr')).not.toBeInTheDocument();
    expect(container.querySelector('div')).toHaveClass('py-8');
  });
});
