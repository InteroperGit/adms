// src/components/ui/BackButton.tsx
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  label?: string;
  className?: string;
}

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
