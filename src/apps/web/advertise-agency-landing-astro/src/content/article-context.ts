// Page-owned context is passed by composition, never read from authored MDX.
import type { OrderFormBlock } from '../types/content-blocks';
import { getOrderFormRegistration } from './order-form-registry';

export type ArticleContext = {
  kind: 'project';
  projectId: number;
  category?: string | null;
  published: boolean;
} | {
  kind: 'service';
  serviceId: string;
  category: string;
  published: boolean;
};

/** Require page publication and the exact owning category/context tuple. */
export function getArticleFormRegistration(
  block: OrderFormBlock,
  owner?: ArticleContext,
) {
  if (!owner?.published || block.context !== owner.kind
    || block.category !== owner.category) return undefined;
  return getOrderFormRegistration(owner.kind, owner.category, block.formId);
}
