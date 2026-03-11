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
        'fixed right-4 top-4 z-50 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm text-muted-foreground shadow-md backdrop-blur-sm transition-colors hover:text-foreground',
        className
      )}
    >
      <ArrowLeft size={16} />
      {label}
    </button>
  );
}
