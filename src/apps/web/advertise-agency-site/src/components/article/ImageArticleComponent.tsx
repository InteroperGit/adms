import {ImageBlock} from "@/types/article";
import ArticleImage from "@/components/misc/ArticleImage";

/**
 * ImageArticleComponent
 *
 * Компонент для отображения изображений внутри текстовых или медиастатей
 * с адаптацией под тёмную тему, поддержкой подписей и адаптивной ширины.
 *
 * Зачем нужен:
 * - Позволяет вставлять изображение в виде `<figure>` с подписью (`<figcaption>`),
 *   что полезно для статей, документации и блогов, где важна семантика.
 * - Использует компонент `next/image` для автоматической оптимизации изображений,
 *   включая lazy-loading, адаптивные размеры и прогрессивную подгрузку.
 * - `aspect-video` позволяет сохранить правильное соотношение сторон (например, 16:9),
 *   при этом картинка адаптивно масштабируется.
 * - При включении `fullWidth` растягивает блок на всю ширину контейнера.
 * - Подпись рендерится только при наличии `caption`.
 *
 * Где использовать:
 * - Внутри CMS-контента (например, статьи, блоги).
 * - В блоках иллюстраций, скриншотов или баннеров, сопровождаемых подписью.
 */
const ImageArticleComponent = ({
                                          image,
                                          fullWidth = false
                                      }: ImageBlock) => (
    <figure className={`my-6 ${fullWidth ? 'w-full' : 'max-w-full'}`}>
        <div className="relative aspect-video rounded-lg overflow-hidden">
            <ArticleImage
                image={image}
                className="object-cover rounded-xl"
                sizes="(max-width: 768px) 100vw, 800px"
            />
        </div>
        {image.caption && (
            <figcaption className="text-lg text-center mt-2 text-gray-500 dark:text-gray-400">
                {image.caption}
            </figcaption>
        )}
    </figure>
);

export default ImageArticleComponent;
