import { render, screen } from '@/test/utils';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/types/legal/index', () => ({
  privacyPolicyContent: {
    title: 'Политика конфиденциальности',
    sections: [],
  },
  userAgreementContent: {
    title: 'Пользовательское соглашение',
    sections: [],
  },
  consentContent: {
    title: 'Согласие на обработку данных',
    sections: [
      {
        id: 's1',
        title: 'Цель обработки',
        blocks: [{ type: 'p', text: 'Данные используются для связи.' }],
      },
    ],
  },
}));

vi.mock('@/components/legal/LegalBlockRenderer', () => ({
  LegalBlockRenderer: () => <div data-testid="legal-block-renderer" />,
}));

vi.mock('@/types/config/legalData', () => ({
  legalData: {
    company: {
      name: 'ООО Тест',
      inn: '000',
      ogrn: '000',
      legalAddress: 'Адрес',
      siteUrl: 'https://test.ru',
      email: 'test@test.ru',
      phone: '+7',
      responsible: 'Иванов',
    },
    documents: {
      privacyPolicy: { version: '1.0', effectiveDate: '01.01.2024' },
      userAgreement: { version: '1.0', effectiveDate: '01.01.2024' },
      consent: { version: '1.0', effectiveDate: '01.01.2024' },
    },
  },
}));

import Consent from './Consent';

describe('Consent', () => {
  it('renders page title', () => {
    render(<Consent />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Согласие на обработку данных' })
    ).toBeInTheDocument();
  });

  it('renders within LegalPageLayout (main element)', () => {
    render(<Consent />);
    expect(document.querySelector('main')).toBeInTheDocument();
  });

  it('renders at least one legal block renderer', () => {
    render(<Consent />);
    expect(screen.getByTestId('legal-block-renderer')).toBeInTheDocument();
  });
});
