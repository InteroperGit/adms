import type { DividerBlock as DividerBlockData } from '@/types/blocks';

interface DividerBlockProps {
  block: DividerBlockData;
}

/**
 * @component
 * @description Divider with multiple visual styles (line, dots, space) for separating content
 * @param {DividerBlockProps} props
 * @param {DividerBlockData} props.block - Divider configuration with style option
 * @returns {JSX.Element} Divider element (hr, dots, or space div)
 * @example
 * <DividerBlock block={{ style: "dots" }} />
 */
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
