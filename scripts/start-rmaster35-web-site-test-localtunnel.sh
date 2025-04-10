#!/bin/bash

# Путь к каталогу с docker-compose файлом
COMPOSE_DIR="../deploy/docker/test/rmaster35-web-site/localtunnel"
COMPOSE_FILE="docker-compose.yml"  # или docker-compose.localtunnel.yml, если ты используешь отдельный файл

# Имя сервиса
SERVICE_NAME="rmaster35-web-site-test-localtunnel"

echo "📦 Перезапуск контейнера $SERVICE_NAME через docker-compose..."

# Переходим в каталог с docker-compose
cd "$COMPOSE_DIR" || {
  echo "❌ Не удалось перейти в каталог $COMPOSE_DIR"
  exit 1
}

# Останавливаем и удаляем контейнеры, затем пересобираем и запускаем
docker-compose -f "$COMPOSE_FILE" down
docker-compose -f "$COMPOSE_FILE" up --build -d "$SERVICE_NAME"

echo "✅ Контейнер $SERVICE_NAME перезапущен."
