import { cn } from '@/lib/utils';
import { aboutContent } from '@/types/sections/aboutContent';
import { siteData } from '@/types/config/siteData';

export function AboutText() {
  const { text } = aboutContent;

  return (
    <>
      {text.map((paragraph, i) => (
        <p
          key={i}
          className={cn(
            i === text.length - 1 ? 'mb-10' : 'mb-6',
            'text-base leading-relaxed text-muted-foreground'
          )}
        >
          {paragraph.replace('{name}', siteData.name)}
        </p>
      ))}
    </>
  );
}
