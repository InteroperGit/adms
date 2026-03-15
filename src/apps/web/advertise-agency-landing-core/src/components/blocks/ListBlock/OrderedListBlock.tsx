import { cn } from '@/libs/utils';
import { resolveColor } from '@/libs/resolveColor';
import type { ListBlock as ListBlockData } from '@/types/blocks';

interface OrderedListBlockProps {
  block: ListBlockData;
}

/**
 * @component
 * @description Ordered list (numbered) with optional striped backgrounds
 * @param {OrderedListBlockProps} props
 * @param {ListBlockData} props.block - Ordered list block with items
 * @returns {JSX.Element} ol element with numbered items
 */
export function OrderedListBlock({ block }: OrderedListBlockProps) {
  const defaultTextClass = 'text-muted-foreground leading-relaxed';

  return (
    <ul className="mx-auto max-w-3xl space-y-2">
      {block.items.map((item, i) => {
        const number = i + 1;
        const isEven = i % 2 === 0;
        const rowColors = block.colors
          ? isEven
            ? block.colors.even
            : block.colors.odd
          : undefined;

        const bgStyle = rowColors?.background
          ? { backgroundColor: resolveColor(rowColors.background) }
          : undefined;
        const textStyle = rowColors?.text ? { color: resolveColor(rowColors.text) } : undefined;
        const textClass = rowColors?.text ? 'leading-relaxed' : defaultTextClass;

        return (
          <li
            key={i}
            className={cn('px-3 py-2 rounded-lg', textClass)}
            style={{ ...bgStyle, ...textStyle }}
          >
            <span className="font-semibold mr-2">{number}.</span>
            {item}
          </li>
        );
      })}
    </ul>
  );
}
