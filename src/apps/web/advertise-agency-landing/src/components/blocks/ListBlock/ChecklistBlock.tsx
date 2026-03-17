import { cn } from '@/libs/utils';
import { resolveListItemStyles } from '@/libs/resolveColor';
import type { ListBlock as ListBlockData } from '@/types/blocks';

interface ChecklistBlockProps {
  block: ListBlockData;
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="8" cy="8" r="8" className="fill-primary/15" />
      <path
        d="M4.5 8l2.5 2.5 4.5-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-primary"
      />
    </svg>
  );
}

/**
 * @component
 * @description Checklist with checkmark icons and optional striped backgrounds
 * @param {ChecklistBlockProps} props
 * @param {ListBlockData} props.block - Checklist block with items
 * @returns {JSX.Element} ul element with checkmark items
 */
export function ChecklistBlock({ block }: ChecklistBlockProps) {
  return (
    <ul className="mx-auto max-w-3xl space-y-3">
      {block.items.map((item, i) => {
        const { bgStyle, textStyle, textClass } = resolveListItemStyles(block.colors, i);

        return (
          <li
            key={i}
            className={cn('flex items-center gap-3 px-3 py-2 rounded-lg', textClass)}
            style={{ ...bgStyle, ...textStyle }}
          >
            <CheckIcon />
            <span>{item}</span>
          </li>
        );
      })}
    </ul>
  );
}
