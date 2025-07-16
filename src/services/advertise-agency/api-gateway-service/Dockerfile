# Stage 1: Build
FROM node:20-alpine AS builder

# Установим pnpm
RUN corepack enable

# Рабочая директория
WORKDIR /app

# Установим зависимости и соберём проект
COPY pnpm-lock.yaml package.json ./
COPY tsconfig.json ./
COPY src ./src

# Устанавливаем все зависимости для сборки
RUN pnpm install --frozen-lockfile
RUN pnpm build

# Stage 2: Runtime
FROM node:20-alpine AS runner

# Установим pnpm
RUN corepack enable

# Рабочая директория
WORKDIR /app

# Копируем только нужные файлы
COPY --from=builder /app/dist ./dist
COPY package.json pnpm-lock.yaml ./

# Устанавливаем только продакшн зависимости
RUN pnpm install --prod --frozen-lockfile

ENV NODE_ENV=production

EXPOSE 3002

CMD ["node", "dist/index.js"]
