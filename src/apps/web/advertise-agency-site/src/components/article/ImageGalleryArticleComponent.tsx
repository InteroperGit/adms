import {cn} from "@/libs/utils";
import {ArticleImageGalleryBlock} from "@/types/article";
import ArticleImage from "@/components/misc/ArticleImage";

/**
 * ImageGalleryArticleComponent
 *
 * Компонент для отображения галереи изображений в статьях, блогах или CMS-контенте
 * с поддержкой трёх макетов: сетка (grid), карусель (carousel) и кирпичная кладка (masonry).
 *
 * Зачем нужен:
 * - Позволяет красиво и гибко визуализировать множество изображений.
 * - Используется в контентных блоках, где нужно отобразить несколько иллюстраций с подписями.
 * - Обеспечивает адаптивную верстку и поддержку тёмной темы.
 *
 * Пропсы:
 * - `images`: массив изображений с `url`, `alt`, и необязательным `caption`.
 * - `layout`: тип отображения — `"grid"` (по умолчанию), `"carousel"` (горизонтальная прокрутка), `"masonry"` (кирпичная кладка).
 * - `columns`: количество колонок в режиме `grid` и `masonry` (по умолчанию 3).
 *
 * Особенности:
 * - В режиме `grid` изображения выстраиваются в сетку с фиксированными пропорциями.
 * - В режиме `carousel` используется горизонтальный `flex`-контейнер с горизонтальным скроллом.
 * - В режиме `masonry` применяется класс `columns`, позволяющий формировать естественный поток изображений разной высоты.
 * - Все изображения стилизованы с помощью `object-cover` и `rounded-xl`.
 * - При наличии `caption` изображение сопровождается подписью в `figcaption`.
 *
 * Где использовать:
 * - В статьях, презентациях, маркетинговых страницах и документации.
 * - В CMS, где автору нужно выбрать способ отображения галереи без ручного кодинга.
 */
const ImageGalleryArticleComponent = ({
                                          images,
                                          layout = 'grid',
                                          columns = 3,
                                      }: ArticleImageGalleryBlock) => {
    const galleryClasses = cn(
        'my-8 gap-4',
        {
            'grid': layout === 'grid',
            'flex overflow-x-auto pb-4': layout === 'carousel',
            'columns-3': layout === 'masonry' && columns === 3,
            'columns-2': layout === 'masonry' && columns === 2,
            [`grid-cols-${columns}`]: layout === 'grid',
        },
        layout === 'grid' && 'items-stretch' // 👈 Растягивает все элементы по высоте
    );

    return (
        <div className={galleryClasses}>
            {images.map((img, idx) => (
                <div
                    key={idx}
                    className={cn(
                        'flex flex-col justify-between',
                        {
                            'min-w-[300px]': layout === 'carousel',
                            'break-inside-avoid': layout === 'masonry',
                        }
                    )}
                >
                    <div className="relative w-full aspect-[16/9]">
                        <ArticleImage
                            image={img}
                            className="rounded-xl object-cover w-full h-full"
                            sizes={layout === 'grid' ? `(max-width: 768px) 100vw, ${800 / columns}px` : '800px'}
                        />
                    </div>

                    {img.caption && (
                        <div className="text-lg text-center text-gray-500 dark:text-gray-400 mt-2">
                            {img.caption}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ImageGalleryArticleComponent;
