import { render, screen } from '@testing-library/react';
import { BlockErrorFallback } from './BlockErrorFallback';

describe('BlockErrorFallback', () => {
  it('renders the inline error message', () => {
    render(<BlockErrorFallback />);
    expect(screen.getByText('Content could not be displayed')).toBeInTheDocument();
  });

  it('renders a status role element', () => {
    render(<BlockErrorFallback />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has accessible aria-label', () => {
    render(<BlockErrorFallback />);
    expect(screen.getByLabelText('Content unavailable')).toBeInTheDocument();
  });

  it('does not throw', () => {
    expect(() => render(<BlockErrorFallback />)).not.toThrow();
  });
});
