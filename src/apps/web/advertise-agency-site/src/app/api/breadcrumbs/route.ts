import {NextRequest, NextResponse} from "next/server";
import {getArticleBySlug} from "@/libs/api/articles";
import {BreadcrumbItem} from "@/types/breadcrumbs";
import {getProjectBySlug} from "@/libs/api/projects";

function getBaseBreadcrumbs(): BreadcrumbItem {
    return { title: "Главная", href: "/" }
}

async function getServiceBreadcrumbs(segments: string[]): Promise<BreadcrumbItem[]> {
    const result: BreadcrumbItem[] = [
        getBaseBreadcrumbs(),
    ];

    const serviceBreadcrumbs = { title: "Услуги", href: "/services" };

    if (segments.length <= 1) {
        result.push({ ...serviceBreadcrumbs, isCurrent: true });
        return result;
    }

    try {
        result.push(serviceBreadcrumbs);
        const service: BreadcrumbItem | null = null;

        if (!service) {
            return result;
        }
    }
    catch (error) {
        console.error(error);
    }

    return result;
}

async function getArticleBreadcrumbs(segments: string[]): Promise<BreadcrumbItem[]> {
    const result: BreadcrumbItem[] = [
        getBaseBreadcrumbs(),
    ];

    const articleBreadcrumbs = { title: "Статьи", href: "/articles" };

    if (segments.length <= 1) {
        result.push({ ...articleBreadcrumbs, isCurrent: true });
        return result;
    }

    try {
        result.push(articleBreadcrumbs);
        const slug = segments[1];
        const article = await getArticleBySlug(slug);

        if (!article) {
            return result;
        }

        result.push({
            title: article.title,
            href: `/articles/${article.slug}`,
            isCurrent: true
        })
    }
    catch (error) {
        console.error(error);
    }

    return result;
}

async function getPortfolioBreadcrumbs(segments: string[]): Promise<BreadcrumbItem[]> {
    const result: BreadcrumbItem[] = [
        getBaseBreadcrumbs(),
    ];

    const portfolioBreadcrumbs = { title: "Портфолио", href: "/portfolio" }

    if (segments.length <= 1) {
        result.push({ ...portfolioBreadcrumbs, isCurrent: true });
        return result;
    }

    try {
        result.push(portfolioBreadcrumbs);
        const slug = segments[1];
        const project = await getProjectBySlug(slug);

        if (!project) {
            return result;
        }

        result.push({
            title: project.title,
            href: `/portfolio/${project.slug}`,
            isCurrent: true
        })
    }
    catch (error) {
        console.error(error);
    }

    return result;
}

async function getNewsBreadcrumbs(segments: string[]): Promise<BreadcrumbItem[]> {
    const result: BreadcrumbItem[] = [
        getBaseBreadcrumbs(),
    ];

    const newsBreadcrumbs = { title: "Новости", href: "/news" };

    if (segments.length <= 1) {
        result.push({ ...newsBreadcrumbs, isCurrent: true });
        return result;
    }

    try {
        result.push(newsBreadcrumbs);
        const news: BreadcrumbItem | null = null;

        if (!news) {
            return result;
        }
    }
    catch (error) {
        console.error(error);
    }

    return result;
}

async function getContactsBreadcrumbs(segments: string[]): Promise<BreadcrumbItem[]> {
    return [
        getBaseBreadcrumbs(),
        {title: "Контакты", href: "/contacts", isCurrent: true},
    ];
}

async function getBreadcrumbs(path: string): Promise<BreadcrumbItem[]> {
    const segments = path.split("/").filter(Boolean);

    const rootPage = segments[0];

    switch (rootPage) {
        case "services":
            return getServiceBreadcrumbs(segments);
        case "articles":
            return getArticleBreadcrumbs(segments);
        case "portfolio":
            return getPortfolioBreadcrumbs(segments);
        case "news":
            return getNewsBreadcrumbs(segments);
        case "contacts":
            return getContactsBreadcrumbs(segments);
        default:
            return Promise.resolve([]);
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");

    if (!path || path.length <= 1) {
        return NextResponse.json([]);
    }

    const breadcrumbs = await getBreadcrumbs(path);

    return NextResponse.json(breadcrumbs);
}