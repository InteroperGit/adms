import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination"

interface Props {
    currentPage: number
    totalPages: number
}

export default function ArticlesPagination({ currentPage, totalPages }: Props) {
    const createPageLink = (page: number) => `/articles/page/${page}`
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