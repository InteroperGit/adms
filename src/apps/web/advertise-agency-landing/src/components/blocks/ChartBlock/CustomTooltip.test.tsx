import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CustomTooltip } from './CustomTooltip';

describe('CustomTooltip', () => {
  it('renders null when active is false', () => {
    const { container } = render(
      <CustomTooltip
        active={false}
        payload={[{ payload: { label: 'Jan', value: 100, displayValue: '100%' } }]}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders null when payload is empty', () => {
    const { container } = render(<CustomTooltip active={true} payload={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders null when payload is undefined', () => {
    const { container } = render(<CustomTooltip active={true} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders label and displayValue when active with payload', () => {
    render(
      <CustomTooltip
        active={true}
        payload={[{ payload: { label: 'January', value: 42, displayValue: '42%' } }]}
      />
    );
    expect(screen.getByText('January')).toBeInTheDocument();
    expect(screen.getByText('42%')).toBeInTheDocument();
  });

  it('falls back to value when displayValue is not present', () => {
    render(<CustomTooltip active={true} payload={[{ payload: { label: 'Feb', value: 75 } }]} />);
    expect(screen.getByText('Feb')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
  });
});
