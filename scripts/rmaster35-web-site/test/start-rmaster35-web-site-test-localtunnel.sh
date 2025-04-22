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

# -----------------------------------------------------------------
# Запускаем NextJS build
# -----------------------------------------------------------------

cd ../..

# Путь к каталогу с docker-compose файлом
COMPOSE_DIR="site-build/next-build"
COMPOSE_FILE="docker-compose.yml"

# Имя сервиса
SERVICE_NAME="rmaster35-web-site-build"

echo "📦 Сборка $SERVICE_NAME через docker-compose..."

# Переходим в каталог с docker-compose
cd "$COMPOSE_DIR" || {
  echo "❌ Не удалось перейти в каталог $COMPOSE_DIR"
  exit 1
}

# Останавливаем и удаляем контейнеры, затем пересобираем и запускаем
docker-compose -f "$COMPOSE_FILE" down --remove-orphans
docker container prune -f
docker image prune -f

# Удаляем существующую директорию output
rm -rf output && mkdir output

docker-compose -f "$COMPOSE_FILE" up --build -d

echo "✅ Сборка $SERVICE_NAME успешно запущена."

# Надежно ждем окончания сборки
echo "Ожидаем завершения сборки..."
while [ ! -f output/build.done ]; do
  sleep 2
done

echo "✅ Сборка завершена."

# -----------------------------------------------------------------
# Запускаем сайт rmaster35
# -----------------------------------------------------------------

cd ../..

# Путь к каталогу с docker-compose файлом
COMPOSE_DIR="test/localtunnel"

# Имя сервиса
SERVICE_NAME="rmaster35-web-site-test-localtunnel"

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

# Удаляем существующую директорию output
rm -rf output

# Копируем ранее собранную
cp -r ../../site-build/next-build/output .

docker-compose -f "$COMPOSE_FILE" up --build -d

echo "✅ Контейнер $SERVICE_NAME перезапущен."
