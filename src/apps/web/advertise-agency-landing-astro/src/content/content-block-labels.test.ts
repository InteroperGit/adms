// The authoring vocabulary covers exactly the current discriminated union.
import { expect, it } from 'vitest';
import { buildContentBlocks } from '../../tests/helpers/fixtures';
import { contentBlockTypeLabels } from './content-block-labels';

it('provides the expected Russian label for every fixture block type', () => {
  expect(Object.keys(contentBlockTypeLabels).sort()).toEqual(
    buildContentBlocks().map(block => block.type).sort(),
  );
  expect(contentBlockTypeLabels).toEqual({
    heading: 'Заголовок', paragraph: 'Текст',
    'ordered-list': 'Нумерованный список',
    'unordered-list': 'Маркированный список', table: 'Таблица',
    chart: 'График', image: 'Изображение',
    'image-gallery': 'Галерея изображений', video: 'Видео',
    'order-form': 'Форма заказа', quote: 'Цитата', footnote: 'Сноска',
  });
});
