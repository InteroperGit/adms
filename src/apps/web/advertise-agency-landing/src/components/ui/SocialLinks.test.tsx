import { render, screen } from '@testing-library/react';
import { SocialLinks } from './SocialLinks';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock icon components to simplify testing their props and presence
vi.mock('@/components/icons', () => ({
  PhoneIcon: vi.fn((props) => <svg data-testid="phone-icon" {...props} />),
  TelegramIcon: vi.fn((props) => <svg data-testid="telegram-icon" {...props} />),
  VkIcon: vi.fn((props) => <svg data-testid="vk-icon" {...props} />),
}));

describe('SocialLinks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const allLinksProps = {
    phone: '1234567890',
    telegram: 'https://t.me/example',
    vk: 'https://vk.com/example',
  };

  // I. Rendering based on props

  it('renders all three buttons when all links are provided', () => {
    render(<SocialLinks {...allLinksProps} />);
    expect(screen.getByRole('link', { name: 'Позвонить' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Telegram' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'ВКонтакте' })).toBeInTheDocument();
  });

  it('renders only the Phone button when only phone link is provided', () => {
    render(<SocialLinks phone="123" />);
    expect(screen.getByRole('link', { name: 'Позвонить' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Telegram' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'ВКонтакте' })).not.toBeInTheDocument();
  });

  it('renders only the Telegram button when only telegram link is provided', () => {
    render(<SocialLinks telegram="https://t.me/example" />);
    expect(screen.queryByRole('link', { name: 'Позвонить' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Telegram' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'ВКонтакте' })).not.toBeInTheDocument();
  });

  it('renders only the VK button when only VK link is provided', () => {
    render(<SocialLinks vk="https://vk.com/example" />);
    expect(screen.queryByRole('link', { name: 'Позвонить' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Telegram' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'ВКонтакте' })).toBeInTheDocument();
  });

  it('renders nothing when no links are provided', () => {
    const { container } = render(<SocialLinks />);
    expect(container).toBeEmptyDOMElement();
  });

  // II. Prop-driven behavior (styling and attributes)

  it('applies dark variant styles when variant is "dark"', () => {
    render(<SocialLinks {...allLinksProps} variant="dark" />);
    const phoneButton = screen.getByRole('link', { name: 'Позвонить' });
    expect(phoneButton).toHaveClass('border-green-400/50');
    // Add more specific class assertions if needed
  });

  it('applies light variant styles when variant is "light" (default)', () => {
    render(<SocialLinks {...allLinksProps} variant="light" />);
    const phoneButton = screen.getByRole('link', { name: 'Позвонить' });
    expect(phoneButton).toHaveClass('border-green-500/25');
    // Add more specific class assertions if needed
  });

  it('applies "sm" size classes and icon size', () => {
    render(<SocialLinks {...allLinksProps} size="sm" />);
    const phoneButton = screen.getByRole('link', { name: 'Позвонить' });
    expect(phoneButton).toHaveClass('h-10');
    expect(phoneButton).toHaveClass('w-10');
    expect(phoneButton).toHaveClass('rounded-lg');
    expect(screen.getByTestId('phone-icon')).toHaveAttribute('data-size', '18');
  });

  it('applies "md" size classes and icon size (default)', () => {
    render(<SocialLinks {...allLinksProps} size="md" />);
    const phoneButton = screen.getByRole('link', { name: 'Позвонить' });
    expect(phoneButton).toHaveClass('h-11');
    expect(phoneButton).toHaveClass('w-11');
    expect(phoneButton).toHaveClass('rounded-xl');
    expect(screen.getByTestId('phone-icon')).toHaveAttribute('data-size', '16');
  });

  it('applies custom className to the root div', () => {
    const { container } = render(
      <SocialLinks {...allLinksProps} className="custom-social-links" />
    );
    expect(container.firstChild).toHaveClass('custom-social-links');
  });

  it('applies animate-pulse-green to phone button when highlightedIndex is 0', () => {
    render(<SocialLinks {...allLinksProps} highlightedIndex={0} />);
    expect(screen.getByRole('link', { name: 'Позвонить' })).toHaveClass('animate-pulse-green');
    expect(screen.getByRole('link', { name: 'Telegram' })).not.toHaveClass('animate-pulse-tg');
  });

  it('applies animate-pulse-tg to telegram button when highlightedIndex is 1', () => {
    render(<SocialLinks {...allLinksProps} highlightedIndex={1} />);
    expect(screen.getByRole('link', { name: 'Telegram' })).toHaveClass('animate-pulse-tg');
    expect(screen.getByRole('link', { name: 'Позвонить' })).not.toHaveClass('animate-pulse-green');
  });

  it('applies animate-pulse-vk to VK button when highlightedIndex is 2', () => {
    render(<SocialLinks {...allLinksProps} highlightedIndex={2} />);
    expect(screen.getByRole('link', { name: 'ВКонтакте' })).toHaveClass('animate-pulse-vk');
    expect(screen.getByRole('link', { name: 'Позвонить' })).not.toHaveClass('animate-pulse-green');
  });

  it('applies no animation classes when highlightedIndex is null or undefined', () => {
    const { rerender } = render(<SocialLinks {...allLinksProps} highlightedIndex={0} />);
    expect(screen.getByRole('link', { name: 'Позвонить' })).toHaveClass('animate-pulse-green');

    rerender(<SocialLinks {...allLinksProps} highlightedIndex={undefined} />);
    expect(screen.getByRole('link', { name: 'Позвонить' })).not.toHaveClass('animate-pulse-green');

    rerender(<SocialLinks {...allLinksProps} highlightedIndex={null} />);
    expect(screen.getByRole('link', { name: 'Позвонить' })).not.toHaveClass('animate-pulse-green');
  });

  it('applies no animation class if highlightedIndex refers to a non-rendered link', () => {
    render(<SocialLinks phone="123" highlightedIndex={1} />); // Telegram not rendered
    expect(screen.getByRole('link', { name: 'Позвонить' })).not.toHaveClass('animate-pulse-green');
  });

  // III. Accessibility and Link Behavior

  it('Phone link has correct href and aria-label', () => {
    render(<SocialLinks phone="1234567890" />);
    const phoneLink = screen.getByRole('link', { name: 'Позвонить' });
    expect(phoneLink).toHaveAttribute('href', 'tel:1234567890');
    expect(phoneLink).toHaveAttribute('aria-label', 'Позвонить');
  });

  it('Telegram link has correct href, target, rel, and aria-label', () => {
    render(<SocialLinks telegram="https://t.me/example" />);
    const telegramLink = screen.getByRole('link', { name: 'Telegram' });
    expect(telegramLink).toHaveAttribute('href', 'https://t.me/example');
    expect(telegramLink).toHaveAttribute('target', '_blank');
    expect(telegramLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(telegramLink).toHaveAttribute('aria-label', 'Telegram');
  });

  it('VK link has correct href, target, rel, and aria-label', () => {
    render(<SocialLinks vk="https://vk.com/example" />);
    const vkLink = screen.getByRole('link', { name: 'ВКонтакте' });
    expect(vkLink).toHaveAttribute('href', 'https://vk.com/example');
    expect(vkLink).toHaveAttribute('target', '_blank');
    expect(vkLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(vkLink).toHaveAttribute('aria-label', 'ВКонтакте');
  });

  it('VkIcon component receives correct size prop', () => {
    render(<SocialLinks vk="https://vk.com/example" size="md" />); // default size
    expect(screen.getByTestId('vk-icon')).toHaveAttribute('data-size', '16');

    vi.clearAllMocks();
    render(<SocialLinks vk="https://vk.com/example" size="sm" />);
    expect(screen.getByTestId('vk-icon')).toHaveAttribute('data-size', '18');
  });
});
