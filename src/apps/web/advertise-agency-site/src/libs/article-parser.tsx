import {
    ArticleBlock,
} from '@/types/article';
import {
    Card, CardContent,
} from "@/components/ui/card"
import TableArticleComponent from "@/components/article/TableArticleComponent";
import TextArticleComponent from "@/components/article/TextArticleComponent";
import ImageArticleComponent from "@/components/article/ImageArticleComponent";
import ImageGalleryArticleComponent from "@/components/article/ImageGalleryArticleComponent";
import PortfolioArticleComponent from "@/components/article/PortfolioArticleComponent";
import VideoArticleComponent from "@/components/article/VideoArticleComponent";
import QuoteArticleComponent from "@/components/article/QuoteArticleComponent";
import CodeArticleComponent from "@/components/article/CodeArticleComponent";
import DividerArticleComponent from "@/components/article/DividerArticleComponent";
import EmbedArticleComponent from "@/components/article/EmbedArticleComponent";
import FormArticleComponent from "@/components/article/FormArticleComponent";

/**
 * Главный парсер статьи
 */
export const ArticleParser = ({ blocks }: { blocks: ArticleBlock[] }) => {
    return (
        <div>
            {blocks.map((block, index) => {
                switch (block.type) {
                    case 'text':
                        return <TextArticleComponent
                            key={index}
                            {...block}
                        />;

                    case 'image':
                        return (
                            <ImageArticleComponent
                                key={index}
                                {...block}
                            />
                        );

                    case 'imageGallery':
                        return (
                            <ImageGalleryArticleComponent
                                key={index}
                                {...block}
                            />
                        );

                    case 'video':
                        return (
                            <VideoArticleComponent
                                key={index}
                                {...block}
                            />
                        );

                    case 'portfolio':
                        return (
                            <PortfolioArticleComponent
                                key={index}
                                {...block}
                            />
                        );

                    case 'quote':
                        return (
                            <QuoteArticleComponent
                                key={index}
                                {...block}
                            />
                        );

                    case 'code':
                        return (
                            <CodeArticleComponent
                                key={index}
                                {...block}
                            />
                        );

                    case 'table':
                        return (
                            <TableArticleComponent
                                key={index}
                                {...block}
                            />
                        );

                    case 'divider':
                        return <DividerArticleComponent
                            key={index}
                            {...block}
                        />;

                    case 'embed':
                        return <EmbedArticleComponent
                            key={index}
                            {...block}
                        />;

                    case 'form':
                        return <FormArticleComponent
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