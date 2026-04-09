import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { OrderForm } from './index';
import type { OrderFormDefinition } from '@/types/config/orderForms';

vi.mock('@/types/shared/iconMap', () => ({
  resolveIcon: () => null,
}));

vi.mock('@/types/shared/imageGallery', () => ({
  imageGalleryContent: {
    prevLabel: 'Prev',
    nextLabel: 'Next',
    closeLabel: 'Close',
    counter: '{current} / {total}',
  },
}));

vi.mock('@/components/ui/imageGallery', () => ({
  ImageGallery: () => <div data-testid="image-gallery" />,
}));

const mockDefinition: OrderFormDefinition = {
  title: 'Заказать рекламу',
  description: 'Заполните форму',
  icon: 'Megaphone',
  tabsLabel: 'Выберите тип',
  productTypes: [
    {
      key: 'banner',
      label: 'Баннер',
      icon: 'RectangleHorizontal',
      description: 'Рекламный баннер',
      fields: [
        {
          key: 'size',
          type: 'select',
          label: 'Размер',
          required: true,
          options: [{ value: 'xl', label: 'XL' }],
        },
      ],
    },
    {
      key: 'video',
      label: 'Видео',
      icon: 'MonitorSmartphone',
      fields: [{ key: 'duration', type: 'number', label: 'Длительность', required: true, min: 10 }],
    },
  ],
  customerFields: [
    { key: 'name', type: 'text', label: 'Имя', required: true },
    { key: 'phone', type: 'text', label: 'Телефон', required: true },
  ],
  consent: {
    text: 'Я соглашаюсь с',
    links: [{ label: 'Политикой', href: '/privacy' }],
    joiner: 'и',
  },
  submit: 'Отправить заявку',
  disclaimer: 'Ваши данные в безопасности',
  success: {
    title: 'Заявка отправлена!',
    text: 'Мы свяжемся с вами.',
    reset: 'Отправить ещё',
  },
  captchaNotConfigured: 'SmartCaptcha site key is not configured.',
  submitFailed: 'Failed to send the form. Please try again.',
  sending: 'Sending...',
};

function renderForm() {
  return render(
    <MemoryRouter>
      <OrderForm definition={mockDefinition} />
    </MemoryRouter>
  );
}

describe('OrderForm', () => {
  it('renders product tabs when multiple product types', () => {
    renderForm();
    expect(screen.getByRole('button', { name: 'Баннер' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Видео' })).toBeInTheDocument();
  });

  it('renders tabs label', () => {
    renderForm();
    expect(screen.getByText('Выберите тип')).toBeInTheDocument();
  });

  it('renders fields for the first active product', () => {
    renderForm();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders customer fields', () => {
    renderForm();
    expect(screen.getByText('Контактные данные')).toBeInTheDocument();
    expect(screen.getByLabelText(/Имя/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Телефон/)).toBeInTheDocument();
  });

  it('renders consent checkbox', () => {
    renderForm();
    expect(screen.getByRole('checkbox', { name: /Я соглашаюсь/ })).toBeInTheDocument();
  });

  it('submit button is disabled when consent not checked', () => {
    renderForm();
    expect(screen.getByRole('button', { name: 'Отправить заявку' })).toBeDisabled();
  });

  it('submit button is enabled after consent is checked', async () => {
    renderForm();
    await userEvent.click(screen.getByRole('checkbox', { name: /Я соглашаюсь/ }));
    expect(screen.getByRole('button', { name: 'Отправить заявку' })).not.toBeDisabled();
  });

  it('switches to second product fields when tab is clicked', async () => {
    renderForm();
    await userEvent.click(screen.getByRole('button', { name: 'Видео' }));
    expect(screen.getByLabelText(/Длительность/)).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('shows success state after valid submission', async () => {
    renderForm();
    // check consent
    await userEvent.click(screen.getByRole('checkbox', { name: /Я соглашаюсь/ }));
    // fill required product field
    await userEvent.selectOptions(screen.getByRole('combobox'), 'xl');
    // fill required customer fields
    await userEvent.type(screen.getByLabelText(/Имя/), 'Иван');
    await userEvent.type(screen.getByLabelText(/Телефон/), '+79001234567');
    await userEvent.click(screen.getByRole('button', { name: 'Отправить заявку' }));
    expect(screen.getByText('Заявка отправлена!')).toBeInTheDocument();
  });

  it('shows reset form after success and clicking reset', async () => {
    renderForm();
    await userEvent.click(screen.getByRole('checkbox', { name: /Я соглашаюсь/ }));
    await userEvent.selectOptions(screen.getByRole('combobox'), 'xl');
    await userEvent.type(screen.getByLabelText(/Имя/), 'Иван');
    await userEvent.type(screen.getByLabelText(/Телефон/), '+79001234567');
    await userEvent.click(screen.getByRole('button', { name: 'Отправить заявку' }));
    expect(screen.getByText('Заявка отправлена!')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Отправить ещё' }));
    expect(screen.getByRole('button', { name: 'Отправить заявку' })).toBeInTheDocument();
  });

  it('renders product description when present', () => {
    renderForm();
    expect(screen.getByText('Рекламный баннер')).toBeInTheDocument();
  });
});
