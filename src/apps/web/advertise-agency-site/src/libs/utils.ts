import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Функция для объединения классов с помощью `clsx` и последующего удаления дублирующихся
 * классов с помощью `tailwind-merge`. Это удобно для динамической генерации классов
 * для компонента, обеспечивая совместимость с Tailwind CSS.
 *
 * @param {ClassValue[]} inputs — массив значений классов, которые могут быть строками,
 * массивами строк или объектами с ключами в виде строк и значениями типа boolean.
 *
 * @returns {string} Возвращает строку с объединёнными и очищенными от дубликатов классами.
 *
 * Пример использования:
 * ```ts
 * const buttonClass = cn("bg-blue-500", isActive && "bg-blue-700", "text-white");
 * // Вернёт: 'bg-blue-500 bg-blue-700 text-white'
 * ```
 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs))
}
