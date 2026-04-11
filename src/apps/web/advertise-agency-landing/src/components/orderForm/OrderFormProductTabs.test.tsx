import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { OrderFormProductTabs } from './OrderFormProductTabs';
import type { ProductType } from '@/types/config/orderForms';

vi.mock('@/types/shared/iconMap', () => ({
  resolveIcon: () => null,
}));

const mockProducts: ProductType[] = [
  { key: 'banner', label: 'Баннер', icon: 'RectangleHorizontal', fields: [] },
  { key: 'video', label: 'Видео', icon: 'MonitorSmartphone', fields: [] },
  { key: 'seo', label: 'SEO', icon: 'LineChart', fields: [] },
];

describe('OrderFormProductTabs', () => {
  it('renders all product tabs', () => {
    render(
      <OrderFormProductTabs productTypes={mockProducts} activeKey="banner" onChange={vi.fn()} />
    );
    expect(screen.getByText('Баннер')).toBeInTheDocument();
    expect(screen.getByText('Видео')).toBeInTheDocument();
    expect(screen.getByText('SEO')).toBeInTheDocument();
  });

  it('active tab has active style class', () => {
    render(
      <OrderFormProductTabs productTypes={mockProducts} activeKey="banner" onChange={vi.fn()} />
    );
    const activeBtn = screen.getByRole('button', { name: 'Баннер' });
    expect(activeBtn).toHaveClass('bg-primary');
  });

  it('inactive tabs do not have active style class', () => {
    render(
      <OrderFormProductTabs productTypes={mockProducts} activeKey="banner" onChange={vi.fn()} />
    );
    expect(screen.getByRole('button', { name: 'Видео' })).not.toHaveClass('bg-primary');
    expect(screen.getByRole('button', { name: 'SEO' })).not.toHaveClass('bg-primary');
  });

  it('clicking a tab calls onChange with its key', async () => {
    const onChange = vi.fn();
    render(
      <OrderFormProductTabs productTypes={mockProducts} activeKey="banner" onChange={onChange} />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Видео' }));
    expect(onChange).toHaveBeenCalledWith('video');
  });

  it('clicking the already active tab still calls onChange', async () => {
    const onChange = vi.fn();
    render(
      <OrderFormProductTabs productTypes={mockProducts} activeKey="banner" onChange={onChange} />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Баннер' }));
    expect(onChange).toHaveBeenCalledWith('banner');
  });
});
