#!/bin/sh

# Запускаем сервер Next.js в фоне
pnpm start &

# Ждем, пока порт поднимется
until curl -s http://localhost:3000 > /dev/null; do
  echo "Жду запуска приложения..."
  sleep 1
done

# Запускаем localtunnel на порту 3000 с поддоменом rmaster35
lt --port 3000 --subdomain rmaster35
