import {
    Article,
    ArticleBlock,
    ArticleDividerBlock, ArticleEmbedBlock, ArticleFormBlock,
    ArticleImageBlock,
    ArticleImageGalleryBlock,
    ArticleQuoteBlock,
    ArticleTextBlock,
    ArticleVideoBlock
} from "@/types/article";
import {
    StrapiArticle,
    StrapiArticleBlock,
    StrapiEmbedBlock, StrapiFormBlock,
    StrapiImageBlock,
    StrapiQuoteBlock,
    StrapiSliderBlock,
    StrapiTextBlock,
    StrapiVideoBlock
} from "@/types/strapi/strapiArticle";
import {markdownToHtml} from "@/libs/converters/markdownToHtml";
import {convertStrapiImage} from "@/libs/converters/strapiImageConverter";

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
                image: convertStrapiImage(strapiImageBlock.file, strapiUrl)
            } as ArticleImageBlock;

            break;
        case "shared.slider":
            const strapiSliderBlock = block as StrapiSliderBlock;
            result = {
                type: "imageGallery",
                images: strapiSliderBlock.files
                            && strapiSliderBlock.files.map((file) => convertStrapiImage(file, strapiUrl)),
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
        case "shared.embed":
            const strapiEmbedBlock = block as StrapiEmbedBlock;
            result = {
                type: "embed",
                html: strapiEmbedBlock.html,
                url: strapiEmbedBlock.url,
                provider: strapiEmbedBlock.provider,
                width: strapiEmbedBlock.width,
                height: strapiEmbedBlock.height,
            } as ArticleEmbedBlock;

            break;
        case "shared.form":
            const strapiFormBlock = block as StrapiFormBlock;
            result = {
                type: "form",
                title: strapiFormBlock.title,
                formType: strapiFormBlock.form_type?.name
            } as ArticleFormBlock

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
        cover: article.cover ? convertStrapiImage(article.cover, strapiUrl) : undefined,
        blocks: article.blocks
            ? (
                await Promise.all(article.blocks.map((block) => parseDynamicBlock(block, strapiUrl)))
              ).filter(filterUndefinedBlocks)
            : undefined
    };

    return Promise.resolve(result);
}