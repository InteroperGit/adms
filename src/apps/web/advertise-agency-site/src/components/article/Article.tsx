import {
    ArticleBlock,
} from '@/types/article';
import TableArticleBlock from "@/components/article/TableArticleBlock";
import TextArticleBlock from "@/components/article/TextArticleBlock";
import ImageArticleBlock from "@/components/article/ImageArticleBlock";
import ImageGalleryArticleBlock from "@/components/article/ImageGalleryArticleBlock";
import PortfolioArticleBlock from "@/components/article/PortfolioArticleBlock";
import VideoArticleBlock from "@/components/article/VideoArticleBlock";
import QuoteArticleBlock from "@/components/article/QuoteArticleBlock";
import CodeArticleBlock from "@/components/article/CodeArticleBlock";
import DividerArticleBlock from "@/components/article/DividerArticleBlock";
import EmbedArticleBlock from "@/components/article/EmbedArticleBlock";
import FormArticleBlock from "@/components/article/FormArticleBlock";
import {JSX} from "react";

/**
 * Компонент `Article` отвечает за рендеринг массива блоков статьи, каждый из которых имеет собственный тип.
 *
 * @param blocks - массив структурированных блоков контента (`ArticleBlock[]`), полученных, например, из CMS (Strapi).
 * Каждый блок имеет поле `type`, определяющее, какой компонент будет использоваться для его отображения.
 *
 * Компонент перебирает все блоки и отображает соответствующий подкомпонент (например, текст, изображение, видео и т.д.),
 * используя `switch` по типу блока. Для каждого типа блоков предусмотрен свой специализированный React-компонент.
 *
 * Это позволяет гибко и масштабируемо отображать произвольный набор контентных блоков на странице статьи.
 */
const Article = ({ blocks }: { blocks: ArticleBlock[] }): JSX.Element =>  {
    return (
        <div>
            {blocks.map((block, index) => {
                switch (block.type) {
                    case 'text':
                        return <TextArticleBlock
                            key={index}
                            {...block}
                        />;

                    case 'image':
                        return (
                            <ImageArticleBlock
                                key={index}
                                {...block}
                            />
                        );

                    case 'imageGallery':
                        return (
                            <ImageGalleryArticleBlock
                                key={index}
                                {...block}
                            />
                        );

                    case 'video':
                        return (
                            <VideoArticleBlock
                                key={index}
                                {...block}
                            />
                        );

                    case 'portfolio':
                        return (
                            <PortfolioArticleBlock
                                key={index}
                                {...block}
                            />
                        );

                    case 'quote':
                        return (
                            <QuoteArticleBlock
                                key={index}
                                {...block}
                            />
                        );

                    case 'code':
                        return (
                            <CodeArticleBlock
                                key={index}
                                {...block}
                            />
                        );

                    case 'table':
                        return (
                            <TableArticleBlock
                                key={index}
                                {...block}
                            />
                        );

                    case 'divider':
                        return <DividerArticleBlock
                            key={index}
                            {...block}
                        />;

                    case 'embed':
                        return <EmbedArticleBlock
                            key={index}
                            {...block}
                        />;

                    case 'form':
                        return <FormArticleBlock
                            key={index}
                            {...block}
                        />

                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default Article;
