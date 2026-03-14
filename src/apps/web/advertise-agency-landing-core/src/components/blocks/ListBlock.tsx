import { cn } from '@/lib/utils';
import type { ListBlock as ListBlockData } from '@/types/portfolio/blocks';

interface ListBlockProps {
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
      className="mt-0.5 shrink-0"
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
 * @description List renderer with three styles: checklist, ordered, unordered
 * @param {ListBlockProps} props
 * @param {ListBlockData} props.block - List block with style and items
 * @returns {JSX.Element} ul or ol element with appropriate styling
 * @example
 * <ListBlock block={{ style: "checklist", items: ["Item 1", "Item 2"] }} />
 */
export function ListBlock({ block }: ListBlockProps) {
  const itemClass = 'text-muted-foreground leading-relaxed';

  if (block.style === 'checklist') {
    return (
      <ul className="mx-auto max-w-3xl space-y-3">
        {block.items.map((item, i) => (
          <li key={i} className={cn('flex items-start gap-3', itemClass)}>
            <CheckIcon />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  const Tag = block.style === 'ordered' ? 'ol' : 'ul';
  const listClass =
    block.style === 'ordered'
      ? 'list-decimal list-outside pl-6 space-y-2'
      : 'list-disc list-outside pl-6 space-y-2';

  return (
    <Tag className={cn('mx-auto max-w-3xl', listClass)}>
      {block.items.map((item, i) => (
        <li key={i} className={itemClass}>
          {item}
        </li>
      ))}
    </Tag>
  );
}
