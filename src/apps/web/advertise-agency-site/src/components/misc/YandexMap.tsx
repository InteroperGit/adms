import React from 'react';

interface YandexMapProps {
    width?: string;
    height?: string;
    constructorId: string;
}

export default function YandexMap({
                                      width = '100%',
                                      height = '320',
                                      constructorId
                                  }: YandexMapProps) {
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