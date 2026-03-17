import { cn, interpolate } from '@/libs/utils';
import { aboutContent } from '@/types/sections/about/aboutContent';
import { siteData } from '@/types/config/siteData';

/**
 * @component
 * @description Multi-paragraph text section from about content with company name interpolation
 * @returns {JSX.Element} Fragment of paragraph elements with responsive spacing and typography
 * @example <caption>About section text content</caption>
 * <AboutText />
 */
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
          {interpolate(paragraph, { name: siteData.name })}
        </p>
      ))}
    </>
  );
}
