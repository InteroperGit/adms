import {DEFAULT_PORTFOLIO_PAGE_SIZE} from "@/config/constants";

export const getBreadcrumbsApiUrl = (): string => {
    const BREADCRUMBS_URL = process.env.NEXT_PUBLIC_BREADCRUMBS_URL;

    if (!BREADCRUMBS_URL) {
        throw new Error("BREADCRUMB_URL environment variable is missing");
    }

    return BREADCRUMBS_URL;
}

export const getFormDataApiUrl = (): string => {
    const FORM_DATA_URL = process.env.NEXT_PUBLIC_FORM_DATA_URL;

    if (!FORM_DATA_URL) {
        throw new Error("Failed to get ford-data service url");
    }

    return FORM_DATA_URL;
}

export const getStrapiUrl = (): string => {
    const STRAPI_URL = process.env.INTERNAL_STRAPI_URL;

    if (!STRAPI_URL) {
        throw new Error("Strapi URL environment variable is missing");
    }

    return STRAPI_URL;
}

export const getNodeEnv = (): string => {
    const NODE_ENV = process.env.NODE_ENV;

    if (!NODE_ENV) {
        throw new Error("NODE_ENV environment variable is missing");
    }

    return NODE_ENV;
}

export const getYandexCompanyId = (): string => {
    const YANDEX_COMPANY_ID = process.env.YANDEX_COMPANY_ID;

    if (!YANDEX_COMPANY_ID) {
        throw new Error("YANDEX_COMPANY_ID environment variable is missing");
    }

    return YANDEX_COMPANY_ID;
}

export const getPortfolioPageSize = (): number => {
    return process.env.PORTFOLIO_PAGE_SIZE && !isNaN(Number(process.env.PORTFOLIO_PAGE_SIZE))
        ? parseInt(process.env.PORTFOLIO_PAGE_SIZE, 10)
        : DEFAULT_PORTFOLIO_PAGE_SIZE;
}