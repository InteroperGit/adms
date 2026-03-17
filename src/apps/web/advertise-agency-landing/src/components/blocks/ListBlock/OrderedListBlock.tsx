import { cn } from '@/libs/utils';
import { resolveListItemStyles } from '@/libs/resolveColor';
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
  return (
    <ol className="mx-auto max-w-3xl space-y-2">
      {block.items.map((item, i) => {
        const number = i + 1;
        const { bgStyle, textStyle, textClass } = resolveListItemStyles(block.colors, i);

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
    </ol>
  );
}
