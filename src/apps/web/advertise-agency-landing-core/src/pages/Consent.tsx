// src/pages/Consent.tsx
import { Link } from 'react-router-dom';
import { BackButton } from '@/components/ui/BackButton.tsx';
import { ScrollToTop } from '@/components/ui/ScrollToTop.tsx';

export default function Consent() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <BackButton className="mb-8" />

      <h1 className="text-3xl font-bold mb-2">Согласие на обработку персональных данных</h1>
      <p className="text-sm text-gray-500 mb-10">Дата вступления в силу: 04 марта 2026 г.</p>

      <Section title="1. Кто даёт согласие">
        <p>
          Настоящее согласие предоставляется физическим лицом (далее — Субъект персональных данных)
          путём проставления отметки в соответствующем поле формы на сайте{' '}
          <strong>[УКАЖИТЕ АДРЕС САЙТА]</strong>.
        </p>
      </Section>

      <Section title="2. Кому даётся согласие">
        <p>
          Согласие предоставляется оператору персональных данных —{' '}
          <strong>[УКАЖИТЕ НАИМЕНОВАНИЕ ОРГАНИЗАЦИИ / ИП]</strong>, зарегистрированному по адресу:{' '}
          <strong>[УКАЖИТЕ ЮРИДИЧЕСКИЙ АДРЕС]</strong>, ИНН <strong>[УКАЖИТЕ ИНН]</strong>, ОГРН{' '}
          <strong>[УКАЖИТЕ ОГРН]</strong> (далее — Оператор).
        </p>
      </Section>

      <Section title="3. Перечень персональных данных">
        <p>Субъект даёт согласие на обработку следующих персональных данных:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Фамилия, имя (при указании в форме)</li>
          <li>Номер телефона</li>
          <li>Адрес электронной почты</li>
          <li>Содержание обращения (описание задачи, запроса на расчёт)</li>
          <li>IP-адрес и технические данные браузера (собираются автоматически)</li>
        </ul>
      </Section>

      <Section title="4. Цели обработки">
        <p>Персональные данные обрабатываются исключительно в следующих целях:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Рассмотрение и обработка запроса на расчёт стоимости рекламных услуг</li>
          <li>Связь с Субъектом для уточнения деталей обращения</li>
          <li>Предоставление информации об услугах Агентства</li>
          <li>Ведение внутренней отчётности Оператора</li>
        </ul>
      </Section>

      <Section title="5. Действия с персональными данными">
        <p>Оператору разрешается выполнять следующие действия с персональными данными:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Сбор, запись и систематизация</li>
          <li>Накопление и хранение</li>
          <li>Уточнение и обновление</li>
          <li>Использование для достижения указанных целей</li>
          <li>Обезличивание и уничтожение по истечении срока хранения</li>
        </ul>
        <p className="mt-3">
          Передача данных третьим лицам, не связанным с исполнением указанных целей,{' '}
          <strong>не допускается</strong> без отдельного согласия Субъекта.
        </p>
      </Section>

      <Section title="6. Срок действия согласия">
        <p>
          6.1. Настоящее согласие действует с момента отправки формы и сохраняет силу в течение{' '}
          <strong>3 (трёх) лет</strong> с момента последнего обращения Субъекта.
        </p>
        <p>
          6.2. По истечении срока персональные данные подлежат уничтожению или обезличиванию, если
          иное не предусмотрено законодательством РФ.
        </p>
      </Section>

      <Section title="7. Порядок отзыва согласия">
        <p>
          7.1. Субъект вправе отозвать настоящее согласие в любое время, направив письменный запрос
          на электронную почту Оператора: <strong>[УКАЖИТЕ EMAIL]</strong>.
        </p>
        <p>7.2. Запрос должен содержать:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>ФИО Субъекта</li>
          <li>Адрес электронной почты или телефон, указанные при отправке формы</li>
          <li>Формулировку: «Отзываю согласие на обработку персональных данных»</li>
        </ul>
        <p className="mt-3">
          7.3. После получения отзыва Оператор прекращает обработку данных и уничтожает их в течение{' '}
          <strong>30 (тридцати) дней</strong>, если иное не предусмотрено законодательством.
        </p>
      </Section>

      <Section title="8. Права субъекта">
        <p>В соответствии с ФЗ-152 Субъект имеет право:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Получить информацию об обработке своих данных</li>
          <li>Требовать уточнения, блокирования или уничтожения данных</li>
          <li>
            Обжаловать действия Оператора в Роскомнадзор (
            <a
              href="https://rkn.gov.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-gray-900 transition-colors"
            >
              rkn.gov.ru
            </a>
            ) или в суд
          </li>
          <li>Получить возмещение убытков и компенсацию морального вреда в судебном порядке</li>
        </ul>
      </Section>

      <Section title="9. Связанные документы">
        <p>Настоящее согласие действует совместно со следующими документами:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>
            <Link
              to="/privacy-policy"
              className="underline underline-offset-2 hover:text-gray-900 transition-colors"
            >
              Политика конфиденциальности
            </Link>{' '}
            — определяет порядок и условия обработки персональных данных
          </li>
          <li>
            <Link
              to="/user-agreement"
              className="underline underline-offset-2 hover:text-gray-900 transition-colors"
            >
              Пользовательское соглашение
            </Link>{' '}
            — регулирует условия использования Сайта
          </li>
        </ul>
      </Section>

      <Section title="10. Контактная информация оператора">
        <dl className="space-y-1">
          {[
            ['Наименование', '[УКАЖИТЕ НАИМЕНОВАНИЕ ОРГАНИЗАЦИИ / ИП]'],
            ['Юридический адрес', '[УКАЖИТЕ ЮРИДИЧЕСКИЙ АДРЕС]'],
            ['ИНН', '[УКАЖИТЕ ИНН]'],
            ['ОГРН', '[УКАЖИТЕ ОГРН]'],
            ['Email', '[УКАЖИТЕ EMAIL]'],
            ['Телефон', '[УКАЖИТЕ ТЕЛЕФОН]'],
            ['Ответственный', '[УКАЖИТЕ ФИО И ДОЛЖНОСТЬ]'],
          ].map(([label, value]) => (
            <div key={label} className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">{label}:</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <p className="text-sm text-gray-500 mt-10 pt-6 border-t border-gray-200">
        Дата последнего обновления: 04 марта 2026 г.
      </p>

      <ScrollToTop />
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-3 text-gray-900">{title}</h2>
      <div className="space-y-2 text-gray-700 leading-relaxed">{children}</div>
    </section>
  );
}
