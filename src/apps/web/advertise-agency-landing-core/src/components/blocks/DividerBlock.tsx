import type { DividerBlock as DividerBlockData } from '@/types/portfolio/blocks';

interface DividerBlockProps {
  block: DividerBlockData;
}

export function DividerBlock({ block }: DividerBlockProps) {
  const style = block.style ?? 'line';

  if (style === 'space') {
    return <div className="py-8" />;
  }

  if (style === 'dots') {
    return (
      <div className="flex justify-center gap-2" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-border" />
        ))}
      </div>
    );
  }

  // default: 'line'
  return <hr className="border-border" />;
}
