import {Entity} from "@/types/base";

export interface StrapiSocialLink extends Entity {
    name: string;
    slug: string;
    title: string;
    description?: string;
    url: string;
}