# FastScore Data Layer Analysis

## Overview
FastScore is a Next.js 16 sports information platform that **does not use a traditional database**. It is a frontend-heavy application that consumes external APIs and caches data in-memory on the server.

---

## 1. Data Sources

### Primary: Vivat Sport Marketing API
- **Type**: External REST API (OAuth2 client_credentials)
- **Base URL**: https://cpservm.com
- **Authentication**: OAuth2 token endpoint at /gateway/token

#### API Endpoints
1. **Prematch Events**: /gateway/marketing/datafeed/prematch/api/v2/sportevents (TTL: 20 sec)
2. **Live Events**: /gateway/marketing/datafeed/live/api/v2/sportevents (TTL: 5 sec)
3. **Sports Dictionary**: /gateway/marketing/datafeed/directories/api/v2/sports (TTL: 1 hour)
4. **Countries Dictionary**: /gateway/marketing/datafeed/directories/api/v2/countries (TTL: 1 hour)
5. **Tournaments**: /gateway/marketing/datafeed/loadtree/prematch/api/v1/tournaments
6. **Results**: /gateway/marketing/result/api/v1/sportevents (TTL: 5 min)

### Secondary: NewsData.io API
- **Type**: Third-party news aggregation
- **URL**: https://newsdata.io/api/1/latest
- **Free Tier**: 200 credits/day, max 10 results per request
- **TTL**: 15 minutes (Next.js revalidate: 900)

---

## 2. Caching Strategy

### In-Memory Server Cache (NodeCache)
- **File**: src/lib/cache.ts
- **Loss**: Data lost on server restart
- **Check Period**: 30 seconds

#### TTL Configuration (src/lib/constants.ts)
```
TOKEN: 3500 seconds (OAuth2 token)
DICTIONARIES: 3600 seconds (Sports, countries, tournaments)
PREMATCH: 20 seconds
LIVE: 5 seconds
RESULTS: 300 seconds
```

### OAuth2 Token Caching
- Auto-retries with fresh token on 401 response
- Cache key: "oauth_token"

---

## 3. API Requests & Response Types

### SportEvent (Prematch/Results)
- sportEventId, sportId, tournamentId
- opponent1NameLocalization, opponent2NameLocalization
- startDate (Unix timestamp)
- oddsLocalization (array of odds)

### LiveSportEvent (extends SportEvent)
- gameStatus (enum: Playing, Finished, HalfTime, etc.)
- fullScore: {sc1, sc2}
- timeSec (seconds elapsed)
- currentPeriodName

### NewsArticle
- id, title, excerpt, url, imageUrl
- source, category, publishedAt (ISO 8601)
- isPromo (boolean)

---

## 4. Client-Side Data Management

### TanStack React Query (v5.91.2)
- **useLiveEvents**: refetchInterval: 10000ms, staleTime: 5000ms
- **usePrematchEvents**: Similar polling strategy
- **useNews**: Custom hook for news with mixing

### No Database/ORM
- NO: Supabase, Prisma, PostgreSQL, MongoDB, Firebase

---

## 5. NextJS API Routes

1. **GET /api/events/live**
   - Params: sportIds, lng, count
   - Returns: Cached live events

2. **GET /api/events/prematch**
   - Params: sportIds, tournamentIds, lng, count
   - Returns: Upcoming events

3. **GET /api/news**
   - Params: category, count, lng
   - Mixes real news with promos (1 per 3 articles)
   - Cache TTL: 900 sec

4. **GET /api/results**
   - Gets past 24 hours
   - Cache TTL: 300 sec

5. **GET /api/results/tournaments**
   - Gets tournaments with results

---

## 6. Fallback & Mock Data

### Fallback Articles (src/lib/news-client.ts)
- 6 hardcoded articles used when API fails
- Includes Champions League, NBA, Tennis news

### Mock Events (src/lib/mock-data.ts)
- MOCK_LIVE_EVENTS: 5 sample matches
- MOCK_PREMATCH_EVENTS: 8 upcoming matches
- FEATURED_MATCH, POPULAR_LEAGUES, STAR_ATHLETES

---

## 7. Error Handling

- OAuth2 401: Auto-retry with fresh token
- Network failures: Return empty array
- News API down: Use fallback articles
- All responses typed with TypeScript

---

## 8. Real-Time Updates

### Polling Only (No WebSockets)
- Live events: 10-second refetch
- Prematch: Periodic refetch
- News: 15-minute ISR

---

## 9. File Storage

### What's Used
- /public directory for static assets
- SVG sport icons, promotional banners
- Remote image patterns: unsplash.com, **.com

### What's NOT Used
- Supabase Storage, S3, Cloudinary
- No file upload endpoints

---

## 10. Environment Variables

```
API_BASE_URL=https://cpservm.com
API_CLIENT_ID=partners-911cc01e4efa0d3b45a6ffbb059870d8
API_CLIENT_SECRET=<secret>
API_REF=282
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEWS_API_KEY=pub_400caae7f3fd49029fa8ac70a278a474
```

---

## 11. Deployment

- **Hosting**: Netlify
- **Architecture**: Serverless functions (Node.js)
- **Caching**: Next.js ISR only for news
- **Build**: Turbopack, React 19 compiler

---

## 12. Data Flow

```
Browser (React Query)
       |
       v
Next.js API Routes (/api/events/*, /api/news, /api/results/*)
       |
       +--- NodeCache (Server-side TTL) ---+
       |                                   |
       v                                   v
Vivat Sport API (OAuth2)          NewsData.io API (API Key)
- Live events (5s)                - News articles (15m)
- Prematch (20s)                  - Category filtering
- Results (5m)
- Dictionaries (1h)
```

---

## 13. Key Files

- **src/lib/api-client.ts**: All API calls
- **src/lib/auth.ts**: OAuth2 flow
- **src/lib/cache.ts**: Caching layer
- **src/lib/constants.ts**: Config & TTL
- **src/app/api/**: NextJS API routes
- **src/hooks/**: TanStack Query hooks
- **src/types/api.ts**: All TypeScript types

---

## 14. Summary

| Component | Tech | Notes |
|-----------|------|-------|
| Database | None | External APIs only |
| Primary API | Vivat Sport (OAuth2) | Sports events, odds, results |
| News API | NewsData.io | Aggregated sports news |
| Server Cache | NodeCache | In-memory, TTL 5-3600 sec |
| Client State | React Query | 10sec refetch, 5sec stale |
| Auth | OAuth2 | Client credentials flow |
| File Storage | Public assets only | No database files |
| Real-time | Polling | No WebSockets |
| i18n | next-intl | 4 languages |
| Deploy | Netlify | Serverless functions |

---

## 15. What's NOT Used

- Supabase database
- Prisma ORM
- PostgreSQL/MongoDB
- Firebase
- Stripe payments
- Authentication (no users)
- WebSockets/SSE
- Redis caching
- S3/Cloudinary storage
- Algolia search
- Analytics platform

