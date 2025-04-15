import {ArticleVideoBlock} from "@/types/article";

/**
 * Компонент для отображения встроенных видеороликов в статьях, блогах или CMS-контенте.
 * Он поддерживает несколько популярных источников видео (YouTube, Vimeo) и автоматически
 * подстраивает размеры видео в зависимости от пропорций, заданных в `aspectRatio`.
 *
 * Зачем нужен:
 * - Удобно интегрирует видеоконтент в статьи или страницы, с возможностью отображения различных источников.
 * - Автоматически подстраивает пропорции видео с помощью соотношения сторон (например, 16:9 или 4:3).
 * - Предоставляет возможность добавить описание (caption) под видео.
 *
 * Пропсы:
 * - `url`: строка URL видео (например, для YouTube или Vimeo).
 * - `source`: источник видео — поддерживаются "youtube" и "vimeo", или произвольный URL.
 * - `caption`: необязательное текстовое описание, которое будет отображаться под видео.
 * - `aspectRatio`: пропорция видео (по умолчанию `16:9`). Задает соотношение ширины и высоты (например, "16:9" или "4:3").
 *
 * Особенности:
 * - Пропорции видео задаются через свойство `aspectRatio` и используются для вычисления отступов с помощью `paddingBottom`.
 * - Для видеохостингов YouTube и Vimeo происходит преобразование ссылок в формат встроенных iframe-элементов.
 * - В случае других видеоресурсов URL отображается как есть.
 * - Встроенные видеоплееры (iframe) настроены для работы на полном экране.
 *
 * Где использовать:
 * - В статьях, где нужно встроить видео с YouTube, Vimeo или другого видеохостинга.
 * - Для проектов, где важно отображение видеоконтента в адаптивном формате.
 */
const VideoArticleComponent = ({
                                   url,
                                   source,
                                   caption,
                                   aspectRatio = '16:9'
                               }: ArticleVideoBlock) => {
    // Преобразование пропорции (aspect ratio) в padding-bottom для обеспечения корректных пропорций.
    const [width, height] = aspectRatio.split(':').map(Number);
    const paddingBottom = `${(height / width) * 100}%`;

    // Генерация URL для встраивания видео с YouTube или Vimeo.
    const embedUrl = source === 'youtube'
        ? `https://www.youtube.com/embed/${url.split('v=')[1]}`
        : source === 'vimeo'
            ? `https://player.vimeo.com/video/${url.split('/').pop()}`
            : url;

    return (
        <div className="my-8">
            <div className="relative w-full" style={{ paddingBottom }}>
                <iframe
                    src={embedUrl}
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    frameBorder="0"
                    allowFullScreen
                />
            </div>
            {caption && (
                <figcaption className="text-lg mt-2 text-center text-gray-500 dark:text-gray-400">
                    {caption}
                </figcaption>
            )}
        </div>
    );
};

export default VideoArticleComponent;