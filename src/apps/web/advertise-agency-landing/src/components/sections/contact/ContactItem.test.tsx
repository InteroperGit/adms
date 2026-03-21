import { render, screen } from '@testing-library/react';
import { ContactItem } from './ContactItem';

// Minimal SVG icon stub
const PhoneIcon = () => <svg data-testid="icon" />;

describe('ContactItem', () => {
  it('renders the icon', () => {
    render(<ContactItem icon={PhoneIcon} label="ТЕЛЕФОН" value="+7 (999) 000-00-00" />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders the label', () => {
    render(<ContactItem icon={PhoneIcon} label="ТЕЛЕФОН" value="+7 (999) 000-00-00" />);
    expect(screen.getByText('ТЕЛЕФОН')).toBeInTheDocument();
  });

  it('renders the value', () => {
    render(<ContactItem icon={PhoneIcon} label="ТЕЛЕФОН" value="+7 (999) 000-00-00" />);
    expect(screen.getByText('+7 (999) 000-00-00')).toBeInTheDocument();
  });

  it('renders value as a link when href is provided', () => {
    render(
      <ContactItem
        icon={PhoneIcon}
        label="ТЕЛЕФОН"
        value="+7 (999) 000-00-00"
        href="tel:+79990000000"
      />
    );
    const link = screen.getByRole('link', { name: '+7 (999) 000-00-00' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'tel:+79990000000');
  });

  it('renders value as plain text when no href provided', () => {
    render(<ContactItem icon={PhoneIcon} label="АДРЕС" value="Москва, ул. Пушкина" />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Москва, ул. Пушкина')).toBeInTheDocument();
  });
});
