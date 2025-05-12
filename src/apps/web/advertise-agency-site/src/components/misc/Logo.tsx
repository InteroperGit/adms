import Link from "next/link";
import { GiButterfly } from "react-icons/gi";
import React, {JSX} from "react";

/**
 * Logo — компонент, который отображает логотип компании с использованием
 * иконки и текста. Логотип состоит из иконки бабочки и текста, который разделён на
 * две части с разными цветами для выделения.
 *
 * Основные особенности:
 * 1. Логотип является ссылкой на главную страницу сайта (href="/").
 * 2. Используется иконка бабочки из библиотеки `react-icons/gi` для визуального
 *    представления бренда.
 * 3. Текст логотипа состоит из двух частей: "Рекла" (оранжевый) и "Мастер"
 *    (синий), что создаёт контраст и выделяет название компании.
 * 4. Логотип имеет классы Tailwind CSS для стилизации текста и иконки, включая
 *    размеры и цвета.
 *
 * Этот компонент полезен для отображения логотипа на страницах сайта, который
 * будет вести на главную страницу.
 */
const Logo: React.FC = (): JSX.Element => {
    return (
        <Link
            href="/"
            className={"inline-flex items-center text-xl font-bold text-primary mr-auto"}>
                <GiButterfly className="text-blue-500 text-2xl mr-2" />
                <span className={"text-orange-500"}>Рекла</span>
                <span className={"text-blue-500"}>Мастер</span>
        </Link>
    );
}

export default Logo;