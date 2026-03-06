import type { PortfolioCase } from '@/types/portfolio';

// Copy this file to data/portfolio/<slug>.ts and fill in your data.
// slug: URL-safe identifier, must match filename without extension
// category: e.g. Брендинг | Digital | Наружная реклама | Полиграфия | SMM
// gradient: Tailwind gradient classes for the card thumbnail and hero background
// tags: 2-4 short keyword tags shown on the portfolio card
// meta.ogUrl: Canonical URL for Open Graph
// meta.ogImage: Optional OG image path (relative to /public)
// testimonialId: Optional. ID of a testimonial from data/testimonials.json
// images.preview: Optional card thumbnail image (relative to /public)
// images.og: Optional Open Graph image (relative to /public)
// images.gallery[].description: Optional caption shown on hover / mobile
export default {
  slug: 'example-project',
  title: 'Название проекта',
  category: 'Брендинг',
  description: 'Краткое описание проекта для карточки портфолио (1-2 предложения).',
  gradient: 'from-orange-400 to-rose-500',
  tags: ['Тег1', 'Тег2', 'Тег3'],
  meta: {
    title: 'Название проекта — кейс РА «Рекламастер»',
    description: 'SEO meta description (120-160 chars).',
    ogUrl: 'https://reklamaster.ru/portfolio/example-project',
    ogImage: '/images/portfolio/example-project/og.jpg',
  },
  overview: {
    client: 'Название клиента',
    year: '2024',
    services: 'Услуга 1, Услуга 2, Услуга 3',
  },
  challenge: 'Описание задачи клиента — что было нужно и почему это было сложно. Один абзац.',
  solution: [
    { title: 'Блок решения 1', description: 'Что конкретно было сделано в рамках этого блока.' },
    { title: 'Блок решения 2', description: 'Описание второго аспекта решения.' },
    { title: 'Блок решения 3', description: 'Описание третьего аспекта решения.' },
  ],
  results: [
    { metric: '+00%', label: 'ключевая метрика', description: 'Контекст: за какой период, в чём измеряется' },
    { metric: '00', label: 'единиц', description: 'Дополнительный результат' },
    { metric: '0 мес.', label: 'реализации', description: 'Срок от брифа до запуска' },
  ],
  testimonialId: 1,
  images: {
    preview: '/images/portfolio/example-project/preview.jpg',
    og: '/images/portfolio/example-project/og.jpg',
    gallery: [
      { src: '/images/portfolio/example-project/01.jpg', description: 'Описание первого изображения' },
      { src: '/images/portfolio/example-project/02.jpg' },
    ],
  },
} satisfies PortfolioCase;
