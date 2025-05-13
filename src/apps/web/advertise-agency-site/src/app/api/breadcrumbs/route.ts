import {NextRequest, NextResponse} from "next/server";
import {getArticleBySlug} from "@/libs/api/articlesApi";
import {BreadcrumbItem} from "@/types/breadcrumbs";
import {getProjectArticleBySlug} from "@/libs/api/projectsApi";
import {getServiceArticleBySlug} from "@/libs/api/servicesApi";
import {getNewsArticleBySlug} from "@/libs/api/newsApi";

const getBaseBreadcrumbs = (): BreadcrumbItem => {
    return { title: "Главная", href: "/" }
}

const getServiceBreadcrumbs = async (segments: string[]): Promise<BreadcrumbItem[]> => {
    const result: BreadcrumbItem[] = [
        getBaseBreadcrumbs(),
    ];

    const serviceBreadcrumbs = { title: "Услуги", href: "/services" };

    if (segments.length <= 1) {
        result.push({ ...serviceBreadcrumbs, isCurrent: true });
        return Promise.resolve(result);
    }
    else {
        result.push(serviceBreadcrumbs);
    }

    try {
        const slug = segments[1];
        const article = await getServiceArticleBySlug(slug);

        if (!article) {
            return result;
        }

        result.push({
            title: article.title,
            isCurrent: true
        } as BreadcrumbItem);
    }
    catch (error) {
        console.error(error);
        return Promise.reject([]);
    }

    return result;
}

const getPortfolioBreadcrumbs = async (segments: string[]): Promise<BreadcrumbItem[]> => {
    const result: BreadcrumbItem[] = [
        getBaseBreadcrumbs(),
    ];

    const portfolioBreadcrumbs = { title: "Портфолио", href: "/portfolio/category/all/1" }

    if (segments.length <= 1 || segments[1] === "category") {
        result.push({ ...portfolioBreadcrumbs, isCurrent: true });
        return Promise.resolve(result);
    }
    else {
        result.push(portfolioBreadcrumbs);
    }

    try {
        const slug = segments[1];
        const project = await getProjectArticleBySlug(slug);

        if (!project) {
            return result;
        }

        result.push({
            title: project.title,
            isCurrent: true
        })
    }
    catch (error) {
        console.error(error);
        return Promise.reject([]);
    }

    return result;
}

const getArticleBreadcrumbs = async (segments: string[]): Promise<BreadcrumbItem[]> => {
    const result: BreadcrumbItem[] = [
        getBaseBreadcrumbs(),
    ];

    const articleBreadcrumbs = { title: "Статьи", href: "/articles/page/1" };

    if (segments.length <= 1 || segments[1] === "page") {
        result.push({ ...articleBreadcrumbs, isCurrent: true });
        return result;
    }
    else {
        result.push(articleBreadcrumbs);
    }

    try {
        const slug = segments[1];
        const article = await getArticleBySlug(slug);

        if (!article) {
            return result;
        }

        result.push({
            title: article.title,
            isCurrent: true
        })
    }
    catch (error) {
        console.error(error);
        return Promise.reject([]);
    }

    return result;
}

const getNewsBreadcrumbs = async (segments: string[]): Promise<BreadcrumbItem[]> => {
    const result: BreadcrumbItem[] = [
        getBaseBreadcrumbs(),
    ];

    const newsBreadcrumbs = { title: "Новости", href: "/news/page/1" };

    if (segments.length <= 1) {
        result.push({ ...newsBreadcrumbs, isCurrent: true });
        return result;
    }
    else {
        result.push(newsBreadcrumbs);
    }

    try {
        const slug = segments[1];
        const article = await getNewsArticleBySlug(slug);

        if (!article) {
            return result;
        }

        result.push({
            title: article.title,
            isCurrent: true
        } as BreadcrumbItem);
    }
    catch (error) {
        console.error(error);
        return Promise.reject([]);
    }

    return result;
}

const getContactsBreadcrumbs = async (): Promise<BreadcrumbItem[]> => {
    return [
        getBaseBreadcrumbs(),
        {title: "Контакты", href: "/contacts", isCurrent: true},
    ];
}

const getBreadcrumbs = async (path: string): Promise<BreadcrumbItem[]> => {
    const segments = path.split("/").filter(Boolean);
    const rootPage = segments[0];

    switch (rootPage) {
        case "services":
            return getServiceBreadcrumbs(segments);
        case "portfolio":
            return getPortfolioBreadcrumbs(segments);
        case "articles":
            return getArticleBreadcrumbs(segments);
        case "news":
            return getNewsBreadcrumbs(segments);
        case "contacts":
            return getContactsBreadcrumbs();
        default:
            return Promise.resolve([]);
    }
}

export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");

    if (!path || path.length <= 1) {
        return NextResponse.json([]);
    }

    const breadcrumbs = await getBreadcrumbs(path);
    return NextResponse.json(breadcrumbs);
}