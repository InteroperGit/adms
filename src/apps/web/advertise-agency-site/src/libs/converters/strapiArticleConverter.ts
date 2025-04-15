import {
    Article,
    ArticleBlock,
    ArticleDividerBlock,
    ArticleImageBlock,
    ArticleImageGalleryBlock,
    ArticleQuoteBlock,
    ArticleTextBlock,
    ArticleVideoBlock
} from "@/types/article";
import {ImageFormats, ImageMeta} from "@/types/image";
import {
    StrapiArticle,
    StrapiArticleBlock, StrapiDividerBlock,
    StrapiImageBlock,
    StrapiQuoteBlock, StrapiSliderBlock,
    StrapiTextBlock, StrapiVideoBlock
} from "@/types/strapi/strapiArticle";
import {markdownToHtml} from "@/libs/converters/markdownToHtml";

function toAbsoluteUrl(url: string | undefined, strapiUrl: string | undefined): string | undefined {
    if (!url || !strapiUrl) {
        return undefined;
    }
    return url.startsWith("http") ? url : `${strapiUrl}${url}`;
}

function normalizeImageMeta(image: ImageMeta | undefined, strapiUrl: string | undefined): ImageMeta | undefined {
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

async function parseDynamicBlock(block: StrapiArticleBlock | undefined, strapiUrl: string | undefined): Promise<ArticleBlock | undefined> {
    if (!block || !strapiUrl) {
        return undefined;
    }

    let result: ArticleBlock | undefined;

    switch(block.__component) {
        case "shared.rich-text":
            const strapiTextBlock = block as StrapiTextBlock;
            result = {
                type: "text",
                align: "left",
                content: await markdownToHtml(strapiTextBlock.body)
            } as ArticleTextBlock;

            break;
        case "shared.media":
            const strapiImageBlock = block as StrapiImageBlock;
            result = {
                type: "image",
                align: "left",
                image: normalizeImageMeta(strapiImageBlock.file, strapiUrl)
            } as ArticleImageBlock;

            break;
        case "shared.slider":
            const strapiSliderBlock = block as StrapiSliderBlock;
            result = {
                type: "imageGallery",
                images: strapiSliderBlock.files
                            && strapiSliderBlock.files.map((file) => normalizeImageMeta(file, strapiUrl)),
                columns: 2,
                layout: "grid"
            } as ArticleImageGalleryBlock

            break;
        case "shared.quote":
            const strapiQuoteBlock = block as StrapiQuoteBlock;
            result = {
                type: "quote",
                author: strapiQuoteBlock.title,
                text: strapiQuoteBlock.body
            } as ArticleQuoteBlock;

            break;
        case "shared.video":
            const strapiVideoBlock = block as StrapiVideoBlock;
            result = {
                type: "video",
                url: strapiVideoBlock.url,
                caption: strapiVideoBlock.caption,
            } as ArticleVideoBlock

            break;
        case "shared.divider":
            result = {
                type: "divider",
            } as ArticleDividerBlock

            break;
        default: return undefined;
    }

    return result;
}

/**
 * Конвертировать объект Strapi article в  Article
 * @param article Статья
 * @param strapiUrl URL Strapi
 */
export async function convertStrapiArticle(article: StrapiArticle | undefined, strapiUrl: string | undefined): Promise<Article | undefined> {
    if (!article || !strapiUrl) {
        return Promise.resolve(undefined);
    }

    const filterUndefinedBlocks = (b: ArticleBlock | undefined): b is ArticleBlock => !!b

    const result: Article = {
        ...article,
        cover: article.cover ? normalizeImageMeta(article.cover, strapiUrl) : undefined,
        blocks: article.blocks
            ? (
                await Promise.all(article.blocks.map((block) => parseDynamicBlock(block, strapiUrl)))
              ).filter(filterUndefinedBlocks)
            : undefined
    };

    return Promise.resolve(result);
}