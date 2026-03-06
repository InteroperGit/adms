import type { Testimonial } from '@/types/testimonials';

// avatarColor: Tailwind gradient classes for the avatar background
export default [
  {
    id: 1,
    name: 'Алексей Воронов',
    role: 'Генеральный директор',
    company: 'Сеть кофеен «Бодрость»',
    avatar: 'АВ',
    avatarColor: 'from-orange-400 to-rose-500',
    rating: 5,
    text: 'Рекламастер полностью переработал наш бренд.',
  },
] satisfies Testimonial[];
