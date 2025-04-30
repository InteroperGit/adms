import {ImageFormats, ImageMeta} from "@/types/image";

function toAbsoluteUrl(url: string | undefined, strapiUrl: string | undefined): string | undefined {
    if (!url || !strapiUrl) {
        return undefined;
    }
    return url.startsWith("http") ? url : `${strapiUrl}${url}`;
}

export function convertStrapiImage(image?: ImageMeta, strapiUrl?: string): ImageMeta | undefined {
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