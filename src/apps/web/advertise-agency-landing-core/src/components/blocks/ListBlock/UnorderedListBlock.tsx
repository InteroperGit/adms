import { cn } from '@/libs/utils';
import type { ListBlock as ListBlockData } from '@/types/blocks';

interface UnorderedListBlockProps {
  block: ListBlockData;
}

/**
 * @component
 * @description Unordered list (bulleted) with optional striped backgrounds
 * @param {UnorderedListBlockProps} props
 * @param {ListBlockData} props.block - Unordered list block with items
 * @returns {JSX.Element} ul element with bulleted items
 */
export function UnorderedListBlock({ block }: UnorderedListBlockProps) {
  const defaultTextClass = 'text-muted-foreground leading-relaxed';

  return (
    <ul className="mx-auto max-w-3xl space-y-2">
      {block.items.map((item, i) => {
        const isEven = i % 2 === 0;
        const rowColors = block.colors
          ? isEven
            ? block.colors.even
            : block.colors.odd
          : undefined;

        const bgStyle = rowColors?.background
          ? { backgroundColor: rowColors.background }
          : undefined;
        const textStyle = rowColors?.text ? { color: rowColors.text } : undefined;
        const textClass = rowColors?.text ? 'leading-relaxed' : defaultTextClass;

        return (
          <li
            key={i}
            className={cn('px-3 py-2 rounded-lg', textClass)}
            style={{ ...bgStyle, ...textStyle }}
          >
            <span className="font-semibold mr-2">•</span>
            {item}
          </li>
        );
      })}
    </ul>
  );
}
