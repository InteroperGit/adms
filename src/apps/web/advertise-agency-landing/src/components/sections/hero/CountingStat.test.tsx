import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Award } from 'lucide-react';
import { CountingStat } from './CountingStat';

describe('CountingStat', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders icon', () => {
    const { container } = render(
      <CountingStat value="150+" label="Клиентов" icon={Award} animate={false} index={0} />
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders label', () => {
    render(<CountingStat value="150+" label="Клиентов" icon={Award} animate={false} index={0} />);
    expect(screen.getByText('Клиентов')).toBeInTheDocument();
  });

  it('shows target number immediately when animate=false', () => {
    render(<CountingStat value="150+" label="Клиентов" icon={Award} animate={false} index={0} />);
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('starts from 0 when animate=true', () => {
    render(<CountingStat value="150+" label="Клиентов" icon={Award} animate={true} index={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('counts up to target after animation completes', () => {
    render(<CountingStat value="150+" label="Клиентов" icon={Award} animate={true} index={0} />);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('renders plain value when no numeric prefix', () => {
    render(<CountingStat value="Много" label="Наград" icon={Award} animate={false} index={0} />);
    expect(screen.getByText('Много')).toBeInTheDocument();
  });

  it('applies stagger delay via index for animation', () => {
    const { container } = render(
      <CountingStat value="150+" label="Клиентов" icon={Award} animate={true} index={2} />
    );
    const card = container.firstChild as HTMLElement;
    expect(card?.style?.animationDelay).toBe('400ms');
  });
});
