import type { ContentBlock } from '../types/content-blocks';

/** Russian names for content block types in authoring interfaces. */
export const contentBlockTypeLabels: Record<ContentBlock['type'], string> = {
  heading: 'Заголовок',
  paragraph: 'Текст',
  'ordered-list': 'Нумерованный список',
  'unordered-list': 'Маркированный список',
  table: 'Таблица',
  chart: 'График',
  image: 'Изображение',
  'image-gallery': 'Галерея изображений',
  'order-form': 'Форма заказа',
  quote: 'Цитата',
  footnote: 'Сноска',
};
