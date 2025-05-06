import {ImageMeta} from "@/types/image";
import {Entity} from "@/types/base";

export interface StrapiClient extends Entity {
    name: string;
    title?: string;
    description?: string;
    logo: ImageMeta;
}