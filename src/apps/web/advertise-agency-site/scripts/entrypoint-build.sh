#!/bin/sh

set -e

echo "Жду доступности Strapi на $STRAPI_SERVICE_URL..."

# Ждем, пока Strapi не станет доступен
until curl -s "$STRAPI_SERVICE_URL" > /dev/null; do
  echo "Strapi еще не доступен..."
  sleep 2
done

echo "Strapi доступен. Начинаю сборку..."

# Чистим папку output
rm -rf /app/output/*
rm -rf /app/output/.[!.]* /app/output/..?*

# Собираем Next.js приложение
pnpm build

# Копируем артефакты сборки
cp -r .next public package.json pnpm-lock.yaml next.config.* tsconfig.json /app/output

# В конце сборки
echo "Build complete" > /app/output/build.done

echo "✅ Сборка завершена. Артефакты сохранены в /app/output."
