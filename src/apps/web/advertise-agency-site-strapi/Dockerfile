# 1. Stage: Build
FROM node:20-alpine AS builder

# Включаем pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Копируем манифесты
COPY package.json pnpm-lock.yaml ./

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Копируем оставшиеся файлы проекта
COPY . .

# Собираем Strapi
RUN pnpm build

# 2. Stage: Production
FROM node:20-alpine

ENV NODE_ENV=production

# Включаем pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Копируем только необходимые артефакты
COPY --from=builder /app ./

# Устанавливаем только production-зависимости
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Удаляем потенциально чувствительные файлы
RUN rm -f .env .env.* *.log

EXPOSE 1337

CMD ["pnpm", "start"]
