/**
 * Базовая сущность, получаемая из внешних источников данных
 */
export interface Entity {
    /**
     * Уникальный идентификатор
     */
    id: number;

    /**
     * Идентификатор документа
     */
    documentId?: string;

    /**
     * Дата создания в формате ISO (YYYY-MM-DD)
     */
    createdAt?: string

    /**
     * Дата обновления в формате ISO (YYYY-MM-DD)
     */
    updatedAt?: string

    /**
     * Дата публикации в формате ISO (YYYY-MM-DD)
     */
    publishedAt?: string
}