import { render, screen } from '@testing-library/react';
import { DevErrorFallback } from './DevErrorFallback';

describe('DevErrorFallback', () => {
  const testError = new Error('Something exploded');

  it('renders the development error heading', () => {
    render(<DevErrorFallback error={testError} />);
    expect(screen.getByText(/Development Error/i)).toBeInTheDocument();
  });

  it('renders the error message', () => {
    render(<DevErrorFallback error={testError} />);
    expect(screen.getByText('Something exploded')).toBeInTheDocument();
  });

  it('renders the error stack when available', () => {
    const errorWithStack = new Error('Stack test');
    errorWithStack.stack = 'Error: Stack test\n    at Foo (foo.tsx:1)';
    render(<DevErrorFallback error={errorWithStack} />);
    expect(screen.getByText('Stack Trace:')).toBeInTheDocument();
    expect(screen.getByText(/at Foo \(foo\.tsx:1\)/)).toBeInTheDocument();
  });

  it('renders the React component stack when provided', () => {
    render(
      <DevErrorFallback error={testError} componentStack="\n    at MyComponent\n    at App" />
    );
    expect(screen.getByText(/React Component Stack/i)).toBeInTheDocument();
    expect(screen.getByText(/at MyComponent/)).toBeInTheDocument();
  });

  it('does not render component stack section when not provided', () => {
    render(<DevErrorFallback error={testError} />);
    expect(screen.queryByText(/React Component Stack/i)).not.toBeInTheDocument();
  });

  it('renders gracefully when error is null', () => {
    render(<DevErrorFallback error={null} />);
    expect(screen.getByText(/Development Error/i)).toBeInTheDocument();
  });

  it('does not throw', () => {
    expect(() => render(<DevErrorFallback error={testError} />)).not.toThrow();
  });
});
