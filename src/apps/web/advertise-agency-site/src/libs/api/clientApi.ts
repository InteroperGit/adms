import {Client} from "@/types/client";
import {StrapiClient} from "@/types/strapi/strapiClient";
import {convertStrapiImage} from "@/libs/converters/strapiImageConverter";

const STRAPI_URL = process.env.INTERNAL_STRAPI_URL;

export const getClients = async (): Promise<Client[]> => {
    if (!STRAPI_URL) {
        throw new Error("URL API Strapi не задан.");
    }

    const res = await fetch(
        `${STRAPI_URL}/api/clients?customPopulate=nested`,
        { next: { revalidate: 60 } }
    );

    if (!res.ok) {
        throw new Error(`Ошибка при получении клиентов: ${res.statusText}`);
    }

    const json = await res.json();

    return json.data?.map((item: StrapiClient) => ({
                id: item.id,
                name: item.name,
                title: item.title,
                description: item.description,
                logo: convertStrapiImage(item.logo, STRAPI_URL),
            } as Client
    ));
}