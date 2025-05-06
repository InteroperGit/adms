import {ImageMeta} from "@/types/image";
import {Entity} from "@/types/base";

export interface Client extends Entity {
    name: string;
    title?: string;
    description?: string;
    logo: ImageMeta;
}