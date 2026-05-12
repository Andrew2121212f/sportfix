# Multi-stage Dockerfile для Next.js 16 (App Router + Turbopack)
# Финальный образ ~150 MB, использует standalone output Next.js.
#
# Build:    docker build -t fastscore:latest .
# Run:      docker run -p 3000:3000 --env-file .env.production fastscore:latest
# Compose:  docker-compose up -d

# ============================================================
# Stage 1: deps — установка зависимостей (отдельный слой для кэша)
# ============================================================
FROM node:22-alpine AS deps
WORKDIR /app

# libc6-compat нужен для некоторых нативных бинарников (sharp, etc.)
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./
# npm ci — точная установка из lockfile, без обновлений
RUN npm ci --no-audit --no-fund

# ============================================================
# Stage 2: builder — сборка Next.js
# ============================================================
FROM node:22-alpine AS builder
WORKDIR /app

# Принимаем build-time переменные (API endpoints, проч.).
# Build-time секреты НЕ передавать — используй runtime env в Stage 3.
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

# Включаем output:"standalone" в next.config — нужен для минимального
# контейнерного образа. Без этой переменной next.config оставляет дефолт
# (нужно для Vercel, где standalone ломает локализованные маршруты).
ENV BUILD_STANDALONE=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Отключаем telemetry Next.js при сборке внутри контейнера
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ============================================================
# Stage 3: runner — финальный production-образ
# ============================================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Non-root пользователь для безопасности
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Public assets (картинки, шрифты, видео)
COPY --from=builder /app/public ./public

# Standalone-сборка: только нужные node_modules + server.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Healthcheck — Next.js standalone server слушает на /
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/en || exit 1

CMD ["node", "server.js"]
