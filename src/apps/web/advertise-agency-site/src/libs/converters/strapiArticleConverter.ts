import {
    Article,
    ArticleBlock, ArticleCategory,
    ArticleDividerBlock, ArticleEmbedBlock, ArticleFormBlock,
    ArticleImageBlock,
    ArticleImageGalleryBlock,
    ArticleQuoteBlock, ArticleSEO,
    ArticleTextBlock,
    ArticleVideoBlock
} from "@/types/article";
import {
    StrapiArticle,
} from "@/types/strapi/strapiArticle";
import {markdownToHtml} from "@/libs/converters/markdownToHtml";
import {convertStrapiImage} from "@/libs/converters/strapiImageConverter";
import {Author} from "@/types/author";
import {
    StrapiArticleBlock, StrapiEmbedBlock, StrapiFormBlock,
    StrapiImageBlock, StrapiQuoteBlock,
    StrapiSliderBlock,
    StrapiTextBlock, StrapiVideoBlock
} from "@/types/strapi/strapiArticleBlock";

async function parseDynamicBlock(block?: StrapiArticleBlock, strapiUrl?: string): Promise<ArticleBlock | undefined> {
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
                formType: strapiFormBlock.formType?.name
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
export async function convertStrapiArticleToArticle(article?: StrapiArticle, strapiUrl?: string): Promise<Article | undefined> {
    if (!article || !strapiUrl) {
        return Promise.resolve(undefined);
    }

    const filterUndefinedBlocks = (b: ArticleBlock | undefined): b is ArticleBlock => !!b

    const result: Article = {
        id: article.id,
        slug: article.slug,
        title: article.title,
        description: article.description,
        publishedAt: article.publishedAt,
        readingTime: article.readingTime,
        category: {
            id: article.category?.id,
            name: article.category?.name,
            slug: article.category?.slug,
            title: article.category?.title
        } as ArticleCategory,
        cover: article.cover ? convertStrapiImage(article.cover, strapiUrl) : undefined,
        author: {
            id: article.author?.id,
            name: article.author?.name,
            position: article.author?.position,
        } as Author,
        blocks: article.blocks
            ? (
                await Promise.all(article.blocks.map((block) => parseDynamicBlock(block, strapiUrl)))
              ).filter(filterUndefinedBlocks)
            : undefined,
        seo: article.seo
            ? {
                id: article.seo.id,
                title: article.seo.metaTitle,
                description: article.seo.metaDescription,
                ogImage: article.seo.shareImage
              } as ArticleSEO
            : undefined
    };

    return Promise.resolve(result);
}