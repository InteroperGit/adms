import {ArticleFormBlock} from "@/types/article";
import LightLettersOrderForm from "@/components/forms/LightLettersOrderForm";
import LightBoxOrderForm from "@/components/forms/LightBoxOrderForm";
import BracketOrderForm from "@/components/forms/BracketOrderForm";
import TechnicalDesignOrderForm from "@/components/forms/TechnicalDesignOrderForm";

/**
 * Компонент для отображения формы на основе типа формы, переданного через пропс `formType`.
 * Этот компонент позволяет гибко отображать различные формы в зависимости от указанного типа, обеспечивая расширяемость.
 * Для каждого типа формы, заданного в `formType`, можно добавлять различные формы в функцию `renderForm`.
 *
 * Пропсы:
 * - `formType`: строка, определяющая тип формы, которую нужно отобразить.
 *    - Например, если `formType === 'lightLetters'`, будет отображена форма для заказа световых букв.
 *    - Можно расширить компонент, добавив новые формы, например, для других типов заказов или запросов.
 *
 * Особенности:
 * - Компонент использует функцию `renderForm`, чтобы на основе типа формы динамически выбирать и отображать соответствующую форму.
 * - Гибкость позволяет легко добавлять новые формы по мере необходимости без необходимости вносить изменения в логику компонента.
 *
 * Где использовать:
 * - Этот компонент может быть использован для создания формы заказа или других типов интерактивных форм на страницах,
 * где нужно предложить пользователю различные варианты в зависимости от контекста.
 */
export default function FormBlockArticleBlock({ formType, title }: ArticleFormBlock) {
    const renderForm = () => {
        switch (formType) {
            case 'light-letters':
                return <LightLettersOrderForm title={title} />; // Форма для заказа световых букв
            case 'light-boxes':
                return <LightBoxOrderForm title={title} />;
            case 'brackets':
                return <BracketOrderForm title={title} />;
            case 'technical-design':
                return <TechnicalDesignOrderForm title={title} />;
            default:
                return null; // По умолчанию не отображаем форму
        }
    };

    return (
        <div className="flex flex-col space-y-4">
            {renderForm()} {/* Отображаем соответствующую форму */}
        </div>
    );
};
