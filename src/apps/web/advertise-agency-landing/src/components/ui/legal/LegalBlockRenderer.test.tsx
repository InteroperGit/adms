import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LegalBlockRenderer } from './LegalBlockRenderer';
import type { LegalContent } from '@/types/legal';
import type { LegalData } from '@/types/config/legalData';

const mockCompany: LegalData['company'] = {
  name: 'ООО Пример',
  inn: '1234567890',
  ogrn: '1234567890123',
  legalAddress: 'г. Москва, ул. Примерная, д. 1',
  siteUrl: 'https://example.com',
  email: 'info@example.com',
  phone: '+7 (999) 000-00-00',
  responsible: 'Иванов И.И.',
};

const makeContent = (blocks: LegalContent['sections'][0]['blocks']): LegalContent => ({
  title: 'Test Document',
  sections: [{ id: 'section-1', title: 'Test Section', blocks }],
});

describe('LegalBlockRenderer', () => {
  it('renders paragraph block', () => {
    const content = makeContent([{ type: 'p', text: 'Some legal text.' }]);
    render(<LegalBlockRenderer content={content} company={mockCompany} />);
    expect(screen.getByText('Some legal text.')).toBeInTheDocument();
  });

  it('substitutes {company.X} tokens in paragraph', () => {
    const content = makeContent([{ type: 'p', text: 'Email: {company.email}' }]);
    const { container } = render(<LegalBlockRenderer content={content} company={mockCompany} />);
    expect(container.querySelector('p')?.innerHTML).toContain('info@example.com');
  });

  it('renders unordered list', () => {
    const content = makeContent([{ type: 'ul', items: ['Item one', 'Item two'] }]);
    const { container } = render(<LegalBlockRenderer content={content} company={mockCompany} />);
    const list = container.querySelector('ul');
    expect(list).toBeInTheDocument();
    expect(screen.getByText('Item one')).toBeInTheDocument();
    expect(screen.getByText('Item two')).toBeInTheDocument();
  });

  it('renders ordered list', () => {
    const content = makeContent([{ type: 'ol', items: ['First', 'Second'] }]);
    const { container } = render(<LegalBlockRenderer content={content} company={mockCompany} />);
    const list = container.querySelector('ol');
    expect(list).toBeInTheDocument();
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('renders definition list', () => {
    const content = makeContent([{ type: 'dl', items: [{ term: 'Термин', def: 'Определение' }] }]);
    const { container } = render(<LegalBlockRenderer content={content} company={mockCompany} />);
    expect(container.querySelector('dl')).toBeInTheDocument();
    expect(screen.getByText('Термин')).toBeInTheDocument();
    expect(screen.getByText('— Определение')).toBeInTheDocument();
  });

  it('renders contact block with company data', () => {
    const content = makeContent([
      { type: 'contact', items: [{ label: 'Телефон', field: 'phone' }] },
    ]);
    render(<LegalBlockRenderer content={content} company={mockCompany} />);
    expect(screen.getByText('Телефон:')).toBeInTheDocument();
    expect(screen.getByText('+7 (999) 000-00-00')).toBeInTheDocument();
  });

  it('renders section title', () => {
    const content = makeContent([{ type: 'p', text: 'Content.' }]);
    render(<LegalBlockRenderer content={content} company={mockCompany} />);
    expect(screen.getByText('Test Section')).toBeInTheDocument();
  });

  it('renders multiple sections', () => {
    const content: LegalContent = {
      title: 'Doc',
      sections: [
        { id: 's1', title: 'Section A', blocks: [{ type: 'p', text: 'Text A' }] },
        { id: 's2', title: 'Section B', blocks: [{ type: 'p', text: 'Text B' }] },
      ],
    };
    render(<LegalBlockRenderer content={content} company={mockCompany} />);
    expect(screen.getByText('Section A')).toBeInTheDocument();
    expect(screen.getByText('Section B')).toBeInTheDocument();
  });
});
