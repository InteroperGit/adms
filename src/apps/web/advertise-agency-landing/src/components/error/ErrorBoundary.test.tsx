import { render, screen, act } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

// Suppress React's error boundary console.error noise
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.mocked(console.error).mockRestore();
});

// Component that throws on demand
function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Boom!');
  }
  return <div>Safe content</div>;
}

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('renders custom fallback when error is caught and fallback prop is provided', () => {
    render(
      <ErrorBoundary fallback={<div>Custom fallback</div>}>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
    expect(screen.queryByText('Safe content')).not.toBeInTheDocument();
  });

  it('calls onError callback when an error is caught', () => {
    const onError = vi.fn();
    render(
      <ErrorBoundary onError={onError} fallback={<div>Fallback</div>}>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(onError).toHaveBeenCalledOnce();
    const [error, errorInfo] = onError.mock.calls[0] as [Error, { componentStack: string }];
    expect(error.message).toBe('Boom!');
    expect(errorInfo).toHaveProperty('componentStack');
  });

  it('resets error state when resetKeys change', () => {
    const { rerender } = render(
      <ErrorBoundary resetKeys={['key1']} fallback={<div>Fallback</div>}>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Fallback')).toBeInTheDocument();

    act(() => {
      rerender(
        <ErrorBoundary resetKeys={['key2']} fallback={<div>Fallback</div>}>
          <Bomb shouldThrow={false} />
        </ErrorBoundary>
      );
    });

    expect(screen.getByText('Safe content')).toBeInTheDocument();
    expect(screen.queryByText('Fallback')).not.toBeInTheDocument();
  });

  it('does not reset when resetKeys are unchanged', () => {
    const { rerender } = render(
      <ErrorBoundary resetKeys={['key1']} fallback={<div>Fallback</div>}>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Fallback')).toBeInTheDocument();

    act(() => {
      rerender(
        <ErrorBoundary resetKeys={['key1']} fallback={<div>Fallback</div>}>
          <Bomb shouldThrow={false} />
        </ErrorBoundary>
      );
    });

    // Same key → no reset → still showing fallback
    expect(screen.getByText('Fallback')).toBeInTheDocument();
  });
});
