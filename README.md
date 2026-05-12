# FastScore.be

Live sports scores, match results, odds and statistics for Belgium.
Powered by **Vivat Sport Marketing API**.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create env file (credentials already filled in .env.example)
cp .env.example .env.local

# 3. Run dev server
npm run dev
```

Open http://localhost:3000

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript** (strict)
- **Tailwind CSS v4** (CSS variables, dark/light theme)
- **Framer Motion** (animations)
- **next-intl** (i18n: en, fr, nl, de)

## Pages

| Route | Description |
|-------|-------------|
| `/[locale]` | Home — hero video, live events, prematch, popular leagues |
| `/[locale]/live` | Live matches with real-time scores and odds |
| `/[locale]/matches` | Upcoming prematch events |
| `/[locale]/results` | Match results (23+ sports, real API data) |
| `/[locale]/news` | Sports news |
| `/[locale]/about` | About FastScore + Vivat Sport |
| `/[locale]/contact` | Contact form + info |
| `/[locale]/privacy` | Privacy Policy |
| `/[locale]/terms` | Terms of Service |
| `/[locale]/cookies` | Cookie Policy |

All pages support **4 languages**: English, French, Dutch, German.

## API

Credentials are **server-side only** — never exposed to browser.

| Internal Route | External API |
|----------------|-------------|
| `/api/events/live` | `GET /gateway/marketing/datafeed/live/api/v2/sportevents` |
| `/api/events/prematch` | `GET /gateway/marketing/datafeed/prematch/api/v2/sportevents` |
| `/api/results` | `GET /gateway/marketing/result/api/v1/sports` |
| `/api/results/tournaments` | `GET /gateway/marketing/result/api/v1/tournaments` |

- **Auth**: OAuth2 `client_credentials` → `POST /gateway/token`
- **API Docs**: https://docs-marketing-sport.com/en (login: `marketingsport` / `9ihnsG4jkKSZjDTh`)
- **OpenAPI spec**: `openapi.yaml` in project root

If API is unavailable, mock data is shown as fallback.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with Turbopack (http://localhost:3000) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | ESLint check |

## Theme

Dark/light toggle in header. Brand color: green (`#22c55e` dark / `#16a34a` light).
CSS variables in `src/app/globals.css`.

## Deployment

Any Node.js 18+ hosting. Set env variables from `.env.example`.
