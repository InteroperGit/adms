#!/bin/bash

# Путь к каталогу с docker-compose файлом
COMPOSE_DIR="../../../deploy/docker/rmaster35-web-site/test/strapi"
COMPOSE_FILE="docker-compose.yml"

# -----------------------------------------------------------------
# Останавливаем Strapi
# -----------------------------------------------------------------

# Имя сервиса
SERVICE_NAME="rmaster35-web-site-test-strapi"

echo "📦 Останов контейнеров $SERVICE_NAME через docker-compose..."

# Переходим в каталог с docker-compose
cd "$COMPOSE_DIR" || {
  echo "❌ Не удалось перейти в каталог $COMPOSE_DIR"
  exit 1
}

# Останавливаем и удаляем контейнеры, затем пересобираем и запускаем
docker-compose -f "$COMPOSE_FILE" down --remove-orphans
docker container prune -f
docker image prune -f

echo "✅ Контейнеры $SERVICE_NAME остановлены."

# -----------------------------------------------------------------
# Останавливаем rmaster35-web-site
# -----------------------------------------------------------------

cd ..

# Путь к каталогу с docker-compose файлом
COMPOSE_DIR="localtunnel"

# Имя сервиса
SERVICE_NAME="rmaster35-web-site-test-localtunnel"

echo "📦 Останов контейнеров $SERVICE_NAME через docker-compose..."

# Переходим в каталог с docker-compose
cd "$COMPOSE_DIR" || {
  echo "❌ Не удалось перейти в каталог $COMPOSE_DIR"
  exit 1
}

# Останавливаем и удаляем контейнеры, затем пересобираем и запускаем
docker-compose -f "$COMPOSE_FILE" down --remove-orphans
docker container prune -f
docker image prune -f

echo "✅ Контейнеры $SERVICE_NAME остановлены."

# -----------------------------------------------------------------
# Останавливаем rmaster35-web-site backend
# -----------------------------------------------------------------

cd ../..

# Путь к каталогу с docker-compose файлом
COMPOSE_DIR="prod/backend"

# Имя сервиса
SERVICE_NAME="rmaster35-web-site-backend"

echo "📦 Останов контейнеров $SERVICE_NAME через docker-compose..."

# Переходим в каталог с docker-compose
cd "$COMPOSE_DIR" || {
  echo "❌ Не удалось перейти в каталог $COMPOSE_DIR"
  exit 1
}

# Останавливаем и удаляем контейнеры, затем пересобираем и запускаем
docker-compose -f "$COMPOSE_FILE" down --remove-orphans
docker container prune -f
docker image prune -f

echo "✅ Контейнеры $SERVICE_NAME остановлены."
