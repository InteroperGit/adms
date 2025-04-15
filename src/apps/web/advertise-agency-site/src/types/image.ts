import {Entity} from "@/types/base";

/**
 * Формат изображения
 */
export interface ImageFormat {
    url: string;
    width?: number;
    height?: number;
    size?: number;
    mime?: string;
}

export interface ImageFormats {
    large?: ImageFormat;
    medium?: ImageFormat;
    small?: ImageFormat;
    thumbnail?: ImageFormat;
}

/**
 * Тип Изображение
 */
export interface ImageMeta extends Entity {
    /**
     * URL изображения
     */
    url?: string;

    /**
     * Текст при невозможности загрузить изображение браузером
     */
    alternativeText?: string;

    /**
     * Описание
     */
    caption?: string;

    /**
     * Шиоина
     */
    width?: number;

    /**
     * Высота
     */
    height?: number;

    /**
     * Форматы изображения (разные размеры)
     */
    formats?: ImageFormats;

    /**
     * Формат изображения
     */
    ext?: "jpeg" | "jpg" | "png" | "gif";

    /**
     * MIME-тип
     */
    mime?: string;

    /**
     * Размер
     */
    size?: number;
}