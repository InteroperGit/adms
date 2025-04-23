#!/bin/bash

# -----------------------------------------------------------------
# Запускаем Strapi
# -----------------------------------------------------------------

# Путь к каталогу с docker-compose файлом
COMPOSE_DIR="../../../deploy/docker/rmaster35-web-site/test/strapi"
COMPOSE_FILE="docker-compose.yml"

# Имя сервиса
SERVICE_NAME="rmaster35-web-site-test-strapi"

echo "📦 Перезапуск контейнеров $SERVICE_NAME через docker-compose..."

# Переходим в каталог с docker-compose
cd "$COMPOSE_DIR" || {
  echo "❌ Не удалось перейти в каталог $COMPOSE_DIR"
  exit 1
}

# Останавливаем и удаляем контейнеры, затем пересобираем и запускаем
docker-compose -f "$COMPOSE_FILE" down --remove-orphans
docker container prune -f
docker image prune -f
docker-compose -f "$COMPOSE_FILE" up --build -d

echo "✅ Контейнеры $SERVICE_NAME перезапущены."

# Ждем доступность Strapi
until curl -s http://localhost:1337; do
  echo "Жду Strapi..."
  sleep 2
done

echo "✅ Сервис Strapi успешно запущен"