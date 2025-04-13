import {Entity} from "@/types/base";
import {ImageMeta} from "@/types/image";

/**
 * Автор статьи
 */
export interface Author extends Entity {
    /**
     * ФИО автора
     */
    name: string;

    /**
     * Электронный адрес
     */
    email?: string;

    /**
     * Аватар
     */
    avatar?: ImageMeta

    /**
     * Должность
     */
    position?: string;
}