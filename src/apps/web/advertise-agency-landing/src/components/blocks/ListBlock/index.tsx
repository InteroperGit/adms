import type { ListBlock as ListBlockData } from '@/types/blocks';
import { ChecklistBlock } from './ChecklistBlock';
import { OrderedListBlock } from './OrderedListBlock';
import { UnorderedListBlock } from './UnorderedListBlock';

interface ListBlockProps {
  block: ListBlockData;
}

/**
 * @component
 * @description Router component that delegates to specific list type components
 * @param {ListBlockProps} props
 * @param {ListBlockData} props.block - List block with style and items
 * @returns {JSX.Element} Appropriate list component based on style
 */
export function ListBlock({ block }: ListBlockProps) {
  if (block.style === 'checklist') {
    return <ChecklistBlock block={block} />;
  }

  if (block.style === 'ordered') {
    return <OrderedListBlock block={block} />;
  }

  return <UnorderedListBlock block={block} />;
}
