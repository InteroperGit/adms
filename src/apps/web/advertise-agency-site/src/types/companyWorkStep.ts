/**
 * Рабочий шаг компании
 */
export interface CompanyWorkStep {
    /**
     * Заголовок
     */
    title: string;

    /**
     * Описание
     */
    description: string;

    /**
     * Номер шага
     */
    stepNumber: number;
}