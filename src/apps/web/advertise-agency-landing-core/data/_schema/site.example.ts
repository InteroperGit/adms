import type { SiteData } from '@/types/siteData';

export default {
  name: 'РА «Рекламастер»',
  description: 'Мы создаём рекламу, которая работает',
  // Optional. Numeric org ID from your Yandex Maps URL:
  // yandex.ru/maps/org/<name>/<ID>/reviews — enables the Yandex reviews widget in Testimonials
  yandexMapsOrgId: '12345678901',
  // Optional. Widget iframe URL from Yandex Maps Constructor
  // (replace maps.yandex.ru with yandex.ru/map-widget/v1/) — enables the map in Contact
  yandexMapUrl: 'https://yandex.ru/map-widget/v1/?um=constructor%3AHASH&source=constructorLink',
  contact: {
    phone: '+7 (495) 123-45-67',
    email: 'hello@reklamaster.ru',
    address: 'г. Москва, ул. Тверская, 1, офис 301',
    telegram: 'https://t.me/reklamaster',
    vk: 'https://vk.com/reklamaster',
    workingHours: {
      weekdays: '9:00 — 19:00',
      saturday: '10:00 — 16:00',
      sunday: 'Выходной',
    },
  },
} satisfies SiteData;
