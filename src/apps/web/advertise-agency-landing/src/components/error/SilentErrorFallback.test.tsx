import { render } from '@testing-library/react';
import { SilentErrorFallback } from './SilentErrorFallback';

describe('SilentErrorFallback', () => {
  it('renders nothing (returns null)', () => {
    const { container } = render(<SilentErrorFallback />);
    expect(container).toBeEmptyDOMElement();
  });

  it('does not throw', () => {
    expect(() => render(<SilentErrorFallback />)).not.toThrow();
  });
});
