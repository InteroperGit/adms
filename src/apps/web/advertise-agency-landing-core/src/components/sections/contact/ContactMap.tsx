import { cn } from '@/lib/utils';

interface ContactMapProps {
  url: string;
  className?: string;
  isDark?: boolean;
}

export function ContactMap({ url, className, isDark }: ContactMapProps) {
  return (
    <div className={cn(
        'overflow-hidden rounded-2xl',
        className,
        isDark ? 'border border-primary' : 'sm:shadow-lg')}>
      <iframe
        src={url}
        title="Мы на карте"
        width="100%"
        height="360"
        style={{
            border: 'none',
            display: 'block',
            filter: isDark ? 'invert(1) hue-rotate(180deg) saturate(1.6) brightness(1.1) contrast(1.05)' : 'none',
        }}
        allowFullScreen
      />
    </div>
  );
}
