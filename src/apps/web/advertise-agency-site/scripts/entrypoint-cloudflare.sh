#!/bin/sh

# Запускаем приложение в фоне
pnpm start &

# Ждем, пока порт поднимется
until curl -s http://localhost:3000 > /dev/null; do
  echo "Жду запуска приложения..."
  sleep 1
done

# Запускаем туннель (временно)
cloudflared tunnel --url http://localhost:3000
