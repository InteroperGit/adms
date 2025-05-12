import {ImageFormats, ImageMeta} from "@/types/image";

function toAbsoluteUrl(url: string | undefined, strapiUrl: string | undefined): string | undefined {
    if (!url || !strapiUrl) {
        return undefined;
    }
    return url.startsWith("http") ? url : `${strapiUrl}${url}`;
}

/**
 * Конвертирует изображение, полученное из Strapi, в объект с полными URL для всех форматов изображений.
 * Использует базовый URL Strapi для построения абсолютных ссылок на изображения.
 *
 * @param {ImageMeta} [image] — объект изображения, полученный из Strapi. Может содержать различные форматы изображения.
 * @param {string} [strapiUrl] — базовый URL для Strapi, который используется для формирования абсолютных ссылок на изображения.
 *
 * @returns {ImageMeta | undefined} Возвращает объект изображения с абсолютными URL для всех форматов,
 * или `undefined`, если `image` или `strapiUrl` не указаны.
 *
 * Пример использования:
 * ```ts
 * const image = {
 *   url: '/uploads/image.jpg',
 *   formats: {
 *     small: { url: '/uploads/image_small.jpg' },
 *     large: { url: '/uploads/image_large.jpg' },
 *   }
 * };
 * const strapiUrl = 'https://example.com';
 * const convertedImage = convertStrapiImage(image, strapiUrl);
 * console.log(convertedImage.url); // 'https://example.com/uploads/image.jpg'
 * console.log(convertedImage.formats?.small.url); // 'https://example.com/uploads/image_small.jpg'
 * ```
 */
export const convertStrapiImage = (image?: ImageMeta, strapiUrl?: string): ImageMeta | undefined => {
    if (!image || !strapiUrl) {
        return undefined;
    }

    const formats = image.formats
        ? Object.entries(image.formats).reduce((acc, [key, format]) => {
            acc[key as keyof ImageFormats] = {
                ...format,
                url: toAbsoluteUrl(format.url, strapiUrl),
            };
            return acc;
        }, {} as ImageFormats)
        : undefined;

    return {
        ...image,
        url: toAbsoluteUrl(image.url, strapiUrl),
        formats,
    };
}