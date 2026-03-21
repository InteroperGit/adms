import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';
import userEvent from '@testing-library/user-event';

vi.mock('@/types/config/orderForms', () => ({
  orderFormsData: {
    page: {
      label: 'Заявка',
      title: 'Оформить заказ',
      description: 'Заполните форму ниже',
      defaultFormId: 'branding',
    },
    forms: {
      branding: {
        id: 'branding',
        title: 'Брендинг',
        icon: null,
        fields: [],
        consent: { text: '', required: false },
        success: { title: '', message: '' },
      },
      web: {
        id: 'web',
        title: 'Веб-сайт',
        icon: null,
        fields: [],
        consent: { text: '', required: false },
        success: { title: '', message: '' },
      },
    },
  },
}));

vi.mock('@/types/config/siteData', () => ({
  siteData: { name: 'Рекламастер', homeLabel: 'Главная' },
}));

vi.mock('@/types/shared/iconMap', () => ({
  resolveIcon: () => null,
}));

vi.mock('@/components/ui/orderForm', () => ({
  OrderForm: ({ definition }: { definition: { title: string } }) => (
    <div data-testid="order-form">{definition?.title}</div>
  ),
}));

vi.mock('@/components/ui/navigation/BreadCrumbs', () => ({
  BreadCrumbs: () => <nav data-testid="breadcrumbs" />,
}));

import { OrderPage } from './OrderPage';

function renderAtUrl(search = '') {
  return render(
    <MemoryRouter initialEntries={[`/order${search}`]}>
      <Routes>
        <Route path="/order" element={<OrderPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('OrderPage', () => {
  it('renders the section title', () => {
    renderAtUrl();
    expect(screen.getByText('Оформить заказ')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    renderAtUrl();
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
  });

  it('renders the order form', () => {
    renderAtUrl();
    expect(screen.getByTestId('order-form')).toBeInTheDocument();
  });

  it('renders the default form (branding) when no ?form= param', () => {
    renderAtUrl();
    expect(screen.getByTestId('order-form')).toHaveTextContent('Брендинг');
  });

  it('renders the form selected by ?form= search param', () => {
    renderAtUrl('?form=web');
    expect(screen.getByTestId('order-form')).toHaveTextContent('Веб-сайт');
  });

  it('renders form type selector buttons when multiple forms exist', () => {
    renderAtUrl();
    expect(screen.getByRole('button', { name: 'Брендинг' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Веб-сайт' })).toBeInTheDocument();
  });

  it('active form button has primary styling', () => {
    renderAtUrl();
    const btn = screen.getByRole('button', { name: 'Брендинг' });
    expect(btn.className).toContain('bg-primary');
  });

  it('inactive form button does not have primary styling', () => {
    renderAtUrl();
    const btn = screen.getByRole('button', { name: 'Веб-сайт' });
    expect(btn.className).not.toContain('bg-primary');
  });

  it('clicking a form button switches the active form', async () => {
    const user = userEvent.setup();
    renderAtUrl();
    await user.click(screen.getByRole('button', { name: 'Веб-сайт' }));
    expect(screen.getByTestId('order-form')).toHaveTextContent('Веб-сайт');
  });
});
