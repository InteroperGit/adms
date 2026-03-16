import React from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { ErrorFallback } from './ErrorFallback';
import { DevErrorFallback } from './DevErrorFallback';

/**
 * Props for the ErrorBoundary component.
 */
interface ErrorBoundaryProps {
  /**
   * React nodes to be wrapped by the error boundary.
   * If rendering errors occur in these children, the boundary catches and renders a fallback.
   */
  children: ReactNode;
  /**
   * Optional custom fallback UI to render when an error is caught.
   * If not provided, uses the default `<ErrorFallback />` component.
   */
  fallback?: ReactNode;
  /**
   * Optional callback invoked when an error is caught.
   * Useful for integrating with error reporting services (e.g., Sentry).
   * Called from `componentDidCatch` with the error and component stack info.
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /**
   * Optional array of dependency-like keys.
   * When any key changes, the error state is automatically reset.
   * Useful for resetting on route changes or other state transitions.
   */
  resetKeys?: unknown[];
}

/**
 * Internal state managed by ErrorBoundary.
 */
interface ErrorBoundaryState {
  /**
   * Indicates whether an error has been caught.
   */
  hasError: boolean;
  /**
   * The caught Error object, if any.
   */
  error: Error | null;
  /**
   * React component stack trace from ErrorInfo, if any.
   * Only populated when an error is caught via componentDidCatch.
   */
  componentStack?: string | null;
}

/**
 * ErrorBoundary component - A React class component that catches rendering errors.
 *
 * Catches errors thrown during rendering of child components, prevents white-screen crashes,
 * and displays a fallback UI. Supports optional error reporting integration and automatic
 * reset on dependency changes.
 *
 * **Why a class component?** React 19 does not support error boundaries as functional components.
 * Only class components with `getDerivedStateFromError` and/or `componentDidCatch` can act as error boundaries.
 *
 * **Error catching scope:**
 * - ✓ Rendering errors in child components
 * - ✓ Lifecycle method errors
 * - ✓ Constructor errors
 * - ✗ Event handler errors (use global error handlers via `initGlobalErrorHandlers`)
 * - ✗ Asynchronous errors (use global error handlers via `initGlobalErrorHandlers`)
 * - ✗ Server-side rendering (SSG safe, but errors during server build are not caught)
 *
 * @component
 * @example
 * // Wrap entire app with app-level boundary
 * <ErrorBoundary>
 *   <Header />
 *   <main>
 *     <Outlet />
 *   </main>
 *   <Footer />
 * </ErrorBoundary>
 *
 * @example
 * // With error reporting callback
 * <ErrorBoundary
 *   onError={(error, errorInfo) => {
 *     reportToSentry(error, errorInfo);
 *   }}
 *   resetKeys={[location.pathname]}
 * >
 *   <PageContent />
 * </ErrorBoundary>
 *
 * @example
 * // With custom fallback UI
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <Content />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  /**
   * Constructor - Initialize error boundary state.
   * @param {ErrorBoundaryProps} props - Component props
   */
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      componentStack: undefined,
    };
  }

  /**
   * getDerivedStateFromError - Update state when an error is caught during rendering.
   *
   * This static method is called when a descendant component throws an error.
   * It is used to update component state so the next render displays the fallback UI.
   *
   * @static
   * @param {Error} error - The error thrown by a descendant component
   * @returns {ErrorBoundaryState} New state with hasError set to true
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * componentDidCatch - Log the error and invoke optional error reporting callback.
   *
   * This lifecycle method is called after a descendant component has thrown an error.
   * Use this to log errors to a reporting service, display error notifications, etc.
   *
   * @param {Error} error - The error thrown by a descendant component
   * @param {ErrorInfo} errorInfo - Object containing the component stack trace
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Store component stack in state for dev-mode error display
    this.setState({
      componentStack: errorInfo.componentStack,
    });

    // Log to console in all environments for developer debugging
    console.error(
      '[ErrorBoundary] Caught rendering error:',
      error,
      '\nComponent stack:',
      errorInfo.componentStack
    );

    // Invoke optional error reporting callback (e.g., Sentry integration)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * componentDidUpdate - Auto-reset error state when resetKeys change.
   *
   * Watches the `resetKeys` array. If any key changes, the error state is cleared
   * and children are re-rendered. Useful for resetting errors on route or state changes.
   *
   * @param {ErrorBoundaryProps} prevProps - Previous props
   */
  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Auto-reset error state when resetKeys change (e.g., on navigation)
    if (this.state.hasError && this.props.resetKeys) {
      const keysChanged =
        !prevProps.resetKeys ||
        this.props.resetKeys.some((key, index) => key !== prevProps.resetKeys?.[index]);

      if (keysChanged) {
        this.resetError();
      }
    }
  }

  /**
   * resetError - Clear error state and re-render children.
   *
   * Called when user clicks the reset button on the fallback UI,
   * or when dependencies in resetKeys change.
   */
  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      componentStack: undefined,
    });
  };

  /**
   * render - Render fallback UI on error, otherwise render children.
   *
   * In development mode, shows detailed error information (DevErrorFallback).
   * In production mode, shows user-friendly error message (ErrorFallback).
   *
   * @returns {React.ReactNode} Either the fallback UI or children
   */
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // In development, show detailed error information for debugging
      if (import.meta.env.DEV) {
        return (
          <DevErrorFallback error={this.state.error} componentStack={this.state.componentStack} />
        );
      }

      // In production, show user-friendly error message
      return <ErrorFallback onReset={this.resetError} />;
    }

    return this.props.children;
  }
}
