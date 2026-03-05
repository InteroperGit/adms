// src/pages/Consent.tsx
import { Link } from 'react-router-dom';
import { legalData } from '@/lib/legalData';
import { LegalPageLayout } from '@/components/ui/LegalPageLayout.tsx';
import { LegalSection } from '@/components/ui/LegalSection.tsx';

export default function Consent() {
  const { company, documents } = legalData;
  const { version, effectiveDate } = documents.consent;

  return (
    <LegalPageLayout
      title="Согласие на обработку персональных данных"
      version={version}
      effectiveDate={effectiveDate}
    >
      <LegalSection title="1. Кто даёт согласие">
        <p>
          Настоящее согласие предоставляется физическим лицом (далее — Субъект персональных данных)
          путём проставления отметки в соответствующем поле формы на сайте{' '}
          <strong>{company.siteUrl}</strong>.
        </p>
      </LegalSection>

      <LegalSection title="2. Кому даётся согласие">
        <p>
          Согласие предоставляется оператору персональных данных — <strong>{company.name}</strong>,
          зарегистрированному по адресу: <strong>{company.legalAddress}</strong>, ИНН{' '}
          <strong>{company.inn}</strong>, ОГРН <strong>{company.ogrn}</strong> (далее — Оператор).
        </p>
      </LegalSection>

      <LegalSection title="3. Перечень персональных данных">
        <p>Субъект даёт согласие на обработку следующих персональных данных:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Фамилия, имя (при указании в форме)</li>
          <li>Номер телефона</li>
          <li>Адрес электронной почты</li>
          <li>Содержание обращения (описание задачи, запроса на расчёт)</li>
          <li>IP-адрес и технические данные браузера (собираются автоматически)</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Цели обработки">
        <p>Персональные данные обрабатываются исключительно в следующих целях:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Рассмотрение и обработка запроса на расчёт стоимости рекламных услуг</li>
          <li>Связь с Субъектом для уточнения деталей обращения</li>
          <li>Предоставление информации об услугах Агентства</li>
          <li>Ведение внутренней отчётности Оператора</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Действия с персональными данными">
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
      </LegalSection>

      <LegalSection title="6. Срок действия согласия">
        <p>
          6.1. Настоящее согласие действует с момента отправки формы и сохраняет силу в течение{' '}
          <strong>3 (трёх) лет</strong> с момента последнего обращения Субъекта.
        </p>
        <p>
          6.2. По истечении срока персональные данные подлежат уничтожению или обезличиванию, если
          иное не предусмотрено законодательством РФ.
        </p>
      </LegalSection>

      <LegalSection title="7. Порядок отзыва согласия">
        <p>
          7.1. Субъект вправе отозвать настоящее согласие в любое время, направив письменный запрос
          на электронную почту Оператора: <strong>{company.email}</strong>.
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
      </LegalSection>

      <LegalSection title="8. Права субъекта">
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
      </LegalSection>

      <LegalSection title="9. Связанные документы">
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
      </LegalSection>

      <LegalSection title="10. Контактная информация оператора">
        <dl className="space-y-1">
          {(
            [
              ['Наименование', company.name],
              ['Юридический адрес', company.legalAddress],
              ['ИНН', company.inn],
              ['ОГРН', company.ogrn],
              ['Email', company.email],
              ['Телефон', company.phone],
              ['Ответственный', company.responsible],
            ] as [string, string][]
          ).map(([label, value]) => (
            <div key={label} className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">{label}:</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </LegalSection>
    </LegalPageLayout>
  );
}
