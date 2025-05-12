import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination"
import {JSX} from "react";

interface ArticlePaginationProps {
    urlBasePattern: string;
    currentPage: number
    totalPages: number
}

/**
 * ArticlesPagination — компонент пагинации для статей с возможностью перехода между страницами.
 * Он отображает кнопки для перехода на предыдущую и следующую страницы,
 * а также номера страниц с возможностью перехода на определённую страницу.
 * Если общее количество страниц велико, используются многоточия для сокращения количества отображаемых ссылок.
 *
 * Основные особенности:
 * 1. Поддержка навигации по страницам с динамическим формированием ссылок для каждой страницы.
 * 2. Пагинация отображает текущую страницу и позволяет пользователю перейти на предыдущую и следующую страницу.
 * 3. Используются многоточия (`PaginationEllipsis`), чтобы скрыть промежуточные страницы,
 * если их слишком много.
 * 4. Вычисление видимых страниц с учетом текущей страницы и общего числа страниц
 * (максимум 3 страницы отображаются рядом с текущей).
 * 5. Формирование ссылок с базовым паттерном URL и номером страницы, что позволяет
 * гибко адаптировать пагинацию для разных структур URL.
 *
 * Этот компонент полезен для реализации пагинации на страницах с большим количеством статей или контента.
 */
const ArticlesPagination = ({
                                urlBasePattern,
                                currentPage,
                                totalPages }: ArticlePaginationProps): JSX.Element => {
    const createPageLink = (page: number) => `${urlBasePattern}/${page}`
    const renderedPageNumbers: number[] = []

    const renderPages = () => {
        const pages = []
        const visiblePages = 3
        const startPage = Math.max(1, currentPage - 1)
        const endPage = Math.min(totalPages, startPage + visiblePages - 1)

        for (let i = startPage; i <= endPage; i++) {
            renderedPageNumbers.push(i)
            pages.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href={createPageLink(i)}
                        isActive={i === currentPage}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            )
        }

        return pages
    }

    return (
        <Pagination>
            <PaginationContent>
                {currentPage > 1 && (
                    <PaginationItem>
                        <PaginationPrevious href={createPageLink(currentPage - 1)} />
                    </PaginationItem>
                )}

                {currentPage > 2 && (
                    <>
                        <PaginationItem>
                            <PaginationLink href={createPageLink(1)}>1</PaginationLink>
                        </PaginationItem>
                        {currentPage > 3 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}
                    </>
                )}

                {renderPages()}

                {currentPage < totalPages - 1 && !renderedPageNumbers.includes(totalPages) && (
                    <>
                        {currentPage < totalPages - 2 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}
                        <PaginationItem>
                            <PaginationLink href={createPageLink(totalPages)}>
                                {totalPages}
                            </PaginationLink>
                        </PaginationItem>
                    </>
                )}

                {currentPage < totalPages && (
                    <PaginationItem>
                        <PaginationNext href={createPageLink(currentPage + 1)} />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    )
}

export default ArticlesPagination;