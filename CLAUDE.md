# Проект: fastscore

## Технологии
- **Фреймворк**: Next.js 16 (App Router, Turbopack)
- **UI**: React 19, TypeScript 5 (strict)
- **Стили**: Tailwind CSS 4, PostCSS, class-variance-authority, tailwind-merge, clsx
- **Анимации**: Framer Motion 12
- **Иконки**: Lucide React
- **i18n**: next-intl (en, fr, nl, de)
- **Данные**: TanStack React Query, node-cache (серверный кэш)
- **Линтер**: ESLint 9 (Next.js config)
- **Деплой**: Netlify / Vercel

## Структура
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (events, results)
│   ├── [locale]/          # Локализованные страницы
│   ├── layout.tsx         # Корневой layout
│   └── globals.css        # Глобальные стили + CSS-переменные
├── components/            # React-компоненты
│   ├── layout/            # Header, footer, topbar, sidebar
│   └── sports/            # Карточки матчей, бейджи, логотипы команд
├── hooks/                 # Кастомные хуки (use-live-events, use-prematch-events)
├── i18n/                  # Конфиг i18n + переводы (4 языка)
├── lib/                   # Утилиты (API-клиент, OAuth2 авторизация, кэш, константы)
└── types/                 # TypeScript-типы
public/                    # Статика
```

## База данных
Нет. Данные приходят из внешнего API (Vivat Sport Marketing) через OAuth2 client_credentials flow. При недоступности API — fallback на mock-данные.

## Скрипты
```bash
npm run dev       # Dev-сервер с Turbopack (localhost:3000)
npm run build     # Production-сборка
npm start         # Запуск production-сервера
npm run lint      # ESLint
```

## Правила
- НЕ менять файлы миграций вручную
- НЕ ставить новые зависимости без моего подтверждения
- Перед коммитом запускать линтер (`npm run lint`)
- Объясняй технические решения простым языком
- Комментарии в коде на русском
- Используй TDD подход: сначала тест, потом реализация
- Коммиты на английском языке
- API-ключи (CLIENT_ID, CLIENT_SECRET) хранятся в .env.local — никогда не коммитить
- Git не инициализирован — при необходимости создать репозиторий
