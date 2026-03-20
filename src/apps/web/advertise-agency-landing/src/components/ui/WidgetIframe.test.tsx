import { render, screen } from '@testing-library/react';
import { WidgetIframe } from './WidgetIframe';
import { describe, it, expect } from 'vitest';
import { DARK_IFRAME_FILTER } from '@/libs/utils';

describe('WidgetIframe', () => {
  const defaultProps = {
    src: 'https://example.com/widget',
    title: 'Example Widget',
    height: 300,
    isDark: false, // Added to satisfy required prop
  };

  // 1. Renders iframe with correct src and title
  it('renders iframe with correct src and title attributes', () => {
    render(<WidgetIframe {...defaultProps} />);
    const iframe = screen.getByTitle(defaultProps.title);
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', defaultProps.src);
    expect(iframe).toHaveAttribute('title', defaultProps.title);
  });

  // 2. Renders iframe with correct height and width
  it('renders iframe with correct height and width attributes', () => {
    render(<WidgetIframe {...defaultProps} />);
    const iframe = screen.getByTitle(defaultProps.title);
    expect(iframe).toHaveAttribute('height', defaultProps.height.toString());
    expect(iframe).toHaveAttribute('width', '100%');
  });

  // 3. Applies default loading strategy
  it('applies "eager" loading by default', () => {
    render(<WidgetIframe {...defaultProps} />);
    const iframe = screen.getByTitle(defaultProps.title);
    expect(iframe).toHaveAttribute('loading', 'eager');
  });

  // 4. Applies specified loading strategy
  it('applies specified loading strategy', () => {
    render(<WidgetIframe {...defaultProps} loading="lazy" />);
    const iframe = screen.getByTitle(defaultProps.title);
    expect(iframe).toHaveAttribute('loading', 'lazy');
  });

  // 5. Renders with allowFullScreen attribute
  it('renders with allowFullScreen attribute', () => {
    render(<WidgetIframe {...defaultProps} />);
    const iframe = screen.getByTitle(defaultProps.title);
    expect(iframe).toHaveAttribute('allowFullScreen', '');
  });

  // 6. Renders with border: 'none' and display: 'block' styles
  it('renders iframe with correct inline styles', () => {
    render(<WidgetIframe {...defaultProps} />);
    const iframe = screen.getByTitle(defaultProps.title);
    expect(iframe.style.borderStyle).toBe('none');
    expect(iframe.style.display).toBe('block');
  });

  // 7. Applies dark mode filter when isDark is true
  it('applies dark mode filter when isDark is true', () => {
    render(<WidgetIframe {...defaultProps} isDark={true} />);
    const iframe = screen.getByTitle(defaultProps.title);
    expect(iframe.style.filter).toBe(DARK_IFRAME_FILTER);
  });

  // 8. Does not apply dark mode filter when isDark is false
  it('does not apply dark mode filter when isDark is false', () => {
    render(<WidgetIframe {...defaultProps} isDark={false} />);
    const iframe = screen.getByTitle(defaultProps.title);
    expect(iframe).toHaveStyle('filter: none');
  });

  // 9. Applies overflow-hidden and rounded-2xl classes to the wrapper div
  it('applies base classes to the wrapper div', () => {
    const { container } = render(<WidgetIframe {...defaultProps} />);
    const wrapperDiv = container.firstChild;
    expect(wrapperDiv).toHaveClass('overflow-hidden');
    expect(wrapperDiv).toHaveClass('rounded-2xl');
  });

  // 10. Applies border border-primary to wrapper div when isDark is true
  it('applies dark mode border to wrapper div when isDark is true', () => {
    const { container } = render(<WidgetIframe {...defaultProps} isDark={true} />);
    const wrapperDiv = container.firstChild;
    expect(wrapperDiv).toHaveClass('border');
    expect(wrapperDiv).toHaveClass('border-primary');
  });

  // 11. Applies sm:shadow-lg to wrapper div when isDark is false
  it('applies light mode shadow to wrapper div when isDark is false', () => {
    const { container } = render(<WidgetIframe {...defaultProps} isDark={false} />);
    const wrapperDiv = container.firstChild;
    expect(wrapperDiv).toHaveClass('sm:shadow-lg');
  });

  // 12. Applies additional className prop to the wrapper div
  it('applies additional className to the wrapper div', () => {
    const { container } = render(
      <WidgetIframe {...defaultProps} className="custom-wrapper-class" />
    );
    const wrapperDiv = container.firstChild;
    expect(wrapperDiv).toHaveClass('custom-wrapper-class');
  });

  // 14. Edge Case: Empty src
  it('renders iframe even with an empty src prop', () => {
    render(<WidgetIframe {...defaultProps} src="" />);
    const iframe = screen.getByTitle(defaultProps.title);
    expect(iframe).toBeInTheDocument();
    // React drops empty string src attribute — the iframe still renders
    expect(iframe.tagName).toBe('IFRAME');
  });

  // 15. Edge Case: Zero height
  it('renders iframe with height 0 when prop is 0', () => {
    render(<WidgetIframe {...defaultProps} height={0} />);
    const iframe = screen.getByTitle(defaultProps.title);
    expect(iframe).toHaveAttribute('height', '0');
  });
});
