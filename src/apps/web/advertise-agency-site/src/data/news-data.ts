import {ArticlePreview} from "@/types/article";

/**
 * Новости (превью)
 */
export const newsPreviews: ArticlePreview[] = [
    {
        id: '1',
        slug: '1',
        title: 'Запуск новой линии широкоформатной печати',
        excerpt: 'Наше производство пополнилось новым оборудованием для печати баннеров до 5 метров шириной...',
        category: 'Производство',
        date: '15.06.2024',
        readTime: '4 мин',
        imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: '2',
        slug: '2',
        title: 'Новые экологичные материалы для наружной рекламы',
        excerpt: 'Мы начали использовать биоразлагаемые пленки и чернила на водной основе...',
        category: 'Экология',
        date: '20.06.2024',
        readTime: '5 мин',
        imageUrl: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: '3',
        slug: '3',
        title: 'Как выбрать идеальный шрифт для рекламного баннера',
        excerpt: 'Выбор шрифта влияет на читаемость и восприятие рекламы. Мы собрали рекомендации экспертов...',
        category: 'Дизайн',
        date: '25.06.2024',
        readTime: '6 мин',
        imageUrl: 'https://images.unsplash.com/photo-1514899720986-38b7a1ba8ff9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: '4',
        slug: '4',
        title: 'Тренды наружной рекламы 2024 года',
        excerpt: 'Какие технологии и стили будут популярны в этом году? Разбираем главные тенденции...',
        category: 'Маркетинг',
        date: '30.06.2024',
        readTime: '7 мин',
        imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: '5',
        slug: '5',
        title: 'Современные технологии световых букв',
        excerpt: 'LED, неон и акрил – какие материалы использовать для создания эффектной вывески...',
        category: 'Технологии',
        date: '05.07.2024',
        readTime: '4 мин',
        imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: '6',
        slug: '6',
        title: 'Как правильно ухаживать за рекламными конструкциями',
        excerpt: 'Своевременный уход за вывесками продлевает их срок службы и сохраняет внешний вид...',
        category: 'Обслуживание',
        date: '10.07.2024',
        readTime: '5 мин',
        imageUrl: 'https://images.unsplash.com/photo-1521747116042-5a810fda9664?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: '7',
        slug: '7',
        title: 'Как цифровая печать изменила рынок наружной рекламы',
        excerpt: 'От аналоговой печати к цифровым технологиям – преимущества и перспективы развития...',
        category: 'Производство',
        date: '15.07.2024',
        readTime: '6 мин',
        imageUrl: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: '8',
        slug: '8',
        title: 'Ошибки при проектировании рекламных конструкций',
        excerpt: 'Разбираем распространенные ошибки и даем советы по их предотвращению...',
        category: 'Конструирование',
        date: '20.07.2024',
        readTime: '5 мин',
        imageUrl: 'https://images.unsplash.com/photo-1570528561537-466ade512b00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: '9',
        slug: '9',
        title: 'Выставочные стенды: как привлечь внимание посетителей',
        excerpt: 'Эффективные решения для дизайна стендов и секреты успешного представления бренда...',
        category: 'Выставки',
        date: '25.07.2024',
        readTime: '7 мин',
        imageUrl: 'https://images.unsplash.com/photo-1572025448129-32f7c3e8cc12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: '10',
        slug: '10',
        title: 'Как выбрать оптимальное освещение для наружной рекламы',
        excerpt: 'LED, неон или прожекторы? Разбираем плюсы и минусы разных вариантов...',
        category: 'Освещение',
        date: '30.07.2024',
        readTime: '4 мин',
        imageUrl: 'https://images.unsplash.com/photo-1548345680-f5475ea5df81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
];

/**
 * Самые свежие новости (превью)
 */
export const recentNewsPreviews: ArticlePreview[] = newsPreviews.slice(0, 6);