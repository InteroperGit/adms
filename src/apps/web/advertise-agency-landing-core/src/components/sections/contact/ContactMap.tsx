import { cn } from '@/lib/utils';

interface ContactMapProps {
  url: string;
  className?: string;
}

export function ContactMap({ url, className }: ContactMapProps) {
  return (
    <div className={cn('overflow-hidden rounded-2xl sm:shadow-lg', className)}>
      <iframe
        src={url}
        title="Мы на карте"
        width="100%"
        height="360"
        style={{ border: 'none', display: 'block' }}
        allowFullScreen
      />
    </div>
  );
}
