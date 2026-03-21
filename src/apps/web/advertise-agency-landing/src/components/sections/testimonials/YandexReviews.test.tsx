import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/components/ui/WidgetIframe.tsx', () => ({
  WidgetIframe: ({
    src,
    title,
    isDark,
    height,
    loading,
  }: {
    src: string;
    title: string;
    isDark: boolean;
    height: number;
    loading?: string;
  }) => (
    <iframe
      data-testid="widget-iframe"
      src={src}
      title={title}
      data-is-dark={String(isDark)}
      height={height}
      data-loading={loading}
    />
  ),
}));

import { YandexReviews } from './YandexReviews';

describe('YandexReviews', () => {
  it('renders WidgetIframe with correct src', () => {
    render(<YandexReviews orgId="12345678" title="Отзывы" isDark={false} />);
    const iframe = screen.getByTestId('widget-iframe');
    expect(iframe).toHaveAttribute(
      'src',
      'https://yandex.ru/maps-reviews-widget/12345678?comments'
    );
  });

  it('passes title to WidgetIframe', () => {
    render(<YandexReviews orgId="12345678" title="Отзывы на Яндексе" isDark={false} />);
    expect(screen.getByTitle('Отзывы на Яндексе')).toBeInTheDocument();
  });

  it('passes isDark=true to WidgetIframe', () => {
    render(<YandexReviews orgId="99999" title="Reviews" isDark={true} />);
    const iframe = screen.getByTestId('widget-iframe');
    expect(iframe).toHaveAttribute('data-is-dark', 'true');
  });

  it('passes isDark=false to WidgetIframe', () => {
    render(<YandexReviews orgId="99999" title="Reviews" isDark={false} />);
    const iframe = screen.getByTestId('widget-iframe');
    expect(iframe).toHaveAttribute('data-is-dark', 'false');
  });

  it('uses orgId in the src URL', () => {
    render(<YandexReviews orgId="987654" title="Reviews" isDark={false} />);
    const iframe = screen.getByTestId('widget-iframe');
    expect(iframe.getAttribute('src')).toContain('987654');
  });

  it('passes loading=lazy to WidgetIframe', () => {
    render(<YandexReviews orgId="12345678" title="Reviews" isDark={false} />);
    const iframe = screen.getByTestId('widget-iframe');
    expect(iframe).toHaveAttribute('data-loading', 'lazy');
  });
});
