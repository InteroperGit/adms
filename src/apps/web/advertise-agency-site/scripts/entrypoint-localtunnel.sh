#!/bin/sh

# Устанавливаем зависимости, если они еще не установлены
echo "Устанавливаем зависимости..."
pnpm install --prod --frozen-lockfile

# Запускаем сервер Next.js в фоне
echo "Запускаем сайт..."
pnpm start &

# Ждем, пока порт поднимется
until [ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000)" = "200" ]; do
  echo "Жду запуска сайта..."
  sleep 5
done

echo "Сайт успешно запущен"

# Запускаем localtunnel на порту 3000 с поддоменом rmaster35

echo "Звпускаем localtunnel..."
lt --port 3000 --subdomain rmaster35

echo "localtunnel успешно запущен"