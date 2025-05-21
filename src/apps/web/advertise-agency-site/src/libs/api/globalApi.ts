import {StrapiGlobal} from "@/types/strapi/strapiGlobal";
import {SiteGlobal} from "@/types/siteGlobal";
import {convertStrapiImage} from "@/libs/converters/strapiImageConverter";
import {getStrapiUrl} from "@/libs/envUtils";

const STRAPI_URL = getStrapiUrl();

/**
 * Получить основные данные по сайту
 */
export async function getSiteGlobalData(): Promise<SiteGlobal> {
    const res = await fetch(
        `${STRAPI_URL}/api/global?customPopulate=nested`,
        { next: { revalidate: 60 } }
    );

    if (!res.ok) {
        throw new Error(`Ошибка при получении SEO-данных: ${res.statusText}`);
    }

    const json = await res.json();
    const strapiGlobal: StrapiGlobal = json.data;

    if (!strapiGlobal) {
        throw new Error("Не удалось получить данные по сайту");
    }

    return {
        siteName: strapiGlobal.siteName,
        siteDescription: strapiGlobal.siteDescription,
        favicon: convertStrapiImage(strapiGlobal.favicon),
        seo: {
            title: strapiGlobal.defaultSeo?.metaTitle,
            description: strapiGlobal.defaultSeo?.metaDescription,
            ogImage: convertStrapiImage(strapiGlobal.defaultSeo?.shareImage),
        }
    }
}