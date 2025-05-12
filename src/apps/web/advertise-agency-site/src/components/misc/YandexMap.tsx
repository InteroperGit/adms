import React, {JSX} from 'react';

interface YandexMapProps {
    width?: string;
    height?: string;
    constructorId: string;
}

/**
 * YandexMap — компонент для отображения карты Яндекса на странице с возможностью
 * настройки ширины и высоты. Компонент использует iframe для встраивания виджета
 * карты Яндекса с заранее подготовленным конструктором карт.
 *
 * Основные особенности:
 * 1. Принимает параметры `width` и `height` для настройки размеров карты. По
 *    умолчанию ширина карты составляет 100%, а высота — 320px.
 * 2. Использует `constructorId` для генерации уникального URL карты на основе
 *    идентификатора конструктора.
 * 3. Обёрнут в блок с тенью и скругленными углами для улучшения визуального
 *    восприятия.
 * 4. Встраивает карту с помощью `<iframe>`, используя URL с заданным
 *    `constructorId`, что позволяет показывать кастомизированные карты.
 * 5. Карта поддерживает режим полного экрана через атрибут `allowFullScreen`.
 *
 * Этот компонент полезен для отображения карт с заранее настроенным контентом
 * на сайте, особенно для интеграции карт Яндекса с гибкой настройкой.
 */
const YandexMap: React.FC<YandexMapProps> = ({
                                      width = '100%',
                                      height = '320',
                                      constructorId
                                  }: YandexMapProps): JSX.Element => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <iframe
                src={`https://yandex.ru/map-widget/v1/?um=constructor%3A${constructorId}&source=constructor`}
                width={width}
                height={height}
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen
                aria-hidden="false"
                tabIndex={0}
            />
        </div>
    );
}

export default YandexMap;