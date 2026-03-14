// src/components/ui/BackButton.tsx
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/libs/utils';

interface BackButtonProps {
  label?: string;
  className?: string;
}

/**
 * @component
 * @description Fixed-position back button for navigating to previous page using browser history
 * @param {BackButtonProps} props
 * @param {string} [props.label='Вернуться назад'] - Button text
 * @param {string} [props.className] - Additional button classes
 * @returns {JSX.Element} Fixed button with arrow icon
 * @example
 * <BackButton label="Go Back" />
 */
export function BackButton({ label = 'Вернуться назад', className }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={cn(
        'fixed right-4 top-4 z-50',
        'inline-flex items-center gap-2',
        'rounded-full border border-border bg-background/90 shadow-md backdrop-blur-sm',
        'px-4 py-2 text-sm font-medium text-foreground',
        'transition-colors hover:bg-muted',
        className
      )}
    >
      <ArrowLeft size={16} />
      {label}
    </button>
  );
}
