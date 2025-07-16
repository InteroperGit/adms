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

echo "📦 Ожидание запуска Strapi..."

start_time=$(date +%s)

# Ждем доступность Strapi
until curl -s http://localhost:1337; do
  current_time=$(date +%s)
  elapsed=$((current_time - start_time))
  echo "Ждем уже ${elapsed} секунд..."
  sleep 30
done

echo "✅ Strapi запущен через $(( $(date +%s) - start_time )) секунд"

# -----------------------------------------------------------------
# Запускаем backend
# -----------------------------------------------------------------

cd ../..

# Путь к каталогу с docker-compose файлом
COMPOSE_DIR="prod/backend"
COMPOSE_FILE="docker-compose.yml"

# Имя сервиса
SERVICE_NAME="rmaster35-web-site-backend"

echo "📦 Сборка $SERVICE_NAME через docker-compose..."

# Переходим в каталог с docker-compose
cd "$COMPOSE_DIR" || {
  echo "❌ Не удалось перейти в каталог $COMPOSE_DIR"
  exit 1
}

echo "📦 Останавливаем, удаляем предыдущие контейнеры..."

# Останавливаем и удаляем контейнеры, затем пересобираем и запускаем
docker-compose -f "$COMPOSE_FILE" down --remove-orphans
docker container prune -f
docker image prune -f
docker-compose -f "$COMPOSE_FILE" up --build -d

echo "✅ Контейнеры $SERVICE_NAME перезапущены."

start_time=$(date +%s)

# Ждем доступность служб
until [ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3002/health)" -eq 200 ]; do
  current_time=$(date +%s)
  elapsed=$((current_time - start_time))
  echo "Жду запуска ApiGatewayService ${elapsed} секунд..."
  sleep 30
done

echo "✅ Службы backend запущены через $(( $(date +%s) - start_time )) секунд"

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

start_time=$(date +%s)

while [ ! -f output/build.done ]; do
  current_time=$(date +%s)
  elapsed=$((current_time - start_time))
  echo "Ждем уже ${elapsed} секунд..."
  sleep 30
done

echo "✅ Сборка завершена через $(( $(date +%s) - start_time )) секунд"

# -----------------------------------------------------------------
# Запускаем сайт rmaster35
# -----------------------------------------------------------------

cd ../..

# Путь к каталогу с docker-compose файлом
COMPOSE_DIR="test/localtunnel"

# Имя сервиса
SERVICE_NAME="rmaster35-web-site-test-localtunnel"

echo "📦 Запуск сайта rmaster35-web-site..."

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

start_time=$(date +%s)

# Ждем, пока порт поднимется
until [ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000)" = "200" ]; do
  current_time=$(date +%s)
  elapsed=$((current_time - start_time))
  echo "Ждем уже ${elapsed} секунд..."
  sleep 30
done

echo "✅ Сайт rmaster35-web-site запущен через $(( $(date +%s) - start_time )) секунд"
