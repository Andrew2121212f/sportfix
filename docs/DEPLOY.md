# Deploy guide

Сайт можно деплоить тремя способами:

1. **Vercel** — текущий деплой `master/main` (zero-config)
2. **Docker + любой сервер** (self-hosted, что просит компания)
3. **GitLab CI → Registry → Server** (полная автоматизация)

---

## 1. Vercel (текущий способ)

Уже настроено. Просто `git push origin main` → Vercel автоматически деплоит.

**Live URL**: https://fastscore.vercel.app
**Project ID**: `prj_UYWyz9GngctavLTjg0qiOMKaHmwE` (см. `.vercel/project.json`)

Переменные окружения настроены в Vercel UI:
- Settings → Environment Variables
- Production / Preview / Development

При смене Sheet ID — обнови `NEWS_SHEET_ID` там, redeploy.

---

## 2. Docker (self-hosted)

### Подготовка сервера

Минимальные требования:
- **Docker** 24+ (`docker --version`)
- **docker-compose** v2+ (`docker compose version`)
- **2 CPU, 1 GB RAM** (хватит)
- **Открытый порт** 80/443 (или другой — настрой в `docker-compose.yml`)

### Сборка и запуск

```bash
# 1. Клонируешь репо
git clone https://gitlab.your-company.com/team/fastscore.git
cd fastscore

# 2. Создаёшь .env.production (НЕ КОММИТЬ!)
cp .env.example .env.production
nano .env.production   # подставь реальные значения

# 3. Билдишь и запускаешь
docker-compose up -d --build

# 4. Проверка
curl http://localhost:3000/en   # должен вернуть HTML
docker-compose logs -f web      # смотрим логи
```

Сайт доступен на `http://server-ip:3000`.

### Reverse proxy (nginx/traefik)

Контейнер слушает на 3000. Чтобы добавить SSL и домен — поставь nginx перед ним:

```nginx
# /etc/nginx/sites-available/fastscore
server {
    listen 80;
    server_name vivatbet.sport www.vivatbet.sport;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name vivatbet.sport www.vivatbet.sport;

    ssl_certificate     /etc/letsencrypt/live/vivatbet.sport/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vivatbet.sport/privkey.pem;

    # Безопасные cipher'ы (см. https://ssl-config.mozilla.org/)
    ssl_protocols TLSv1.2 TLSv1.3;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }
}
```

SSL-сертификат — `certbot --nginx -d vivatbet.sport`.

### Обновление

```bash
git pull
docker-compose up -d --build   # пересоберёт только если что-то изменилось
docker image prune -f          # чистим старые образы
```

Zero-downtime: используй `docker-compose up -d --no-deps --build web` — пересоберёт контейнер пока старый ещё крутится. Next.js standalone server graceful-shutdown поддерживает.

### Мониторинг и логи

```bash
# Статус
docker-compose ps

# Логи (последние 100 строк, потом следить)
docker-compose logs --tail=100 -f web

# Использование ресурсов
docker stats fastscore-web

# Restart при проблеме
docker-compose restart web
```

Логи Next.js пишутся в stdout — собирай через **journald** / **fluentd** / **promtail+Loki** для централизованного логирования.

---

## 3. GitLab CI → Registry → Server

Если у компании свой GitLab Runner — добавь `.gitlab-ci.yml`:

```yaml
stages:
  - build
  - deploy

variables:
  IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  IMAGE_LATEST: $CI_REGISTRY_IMAGE:latest

build:
  stage: build
  image: docker:24-cli
  services:
    - docker:24-dind
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $IMAGE -t $IMAGE_LATEST .
    - docker push $IMAGE
    - docker push $IMAGE_LATEST
  only:
    - main

deploy:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh && chmod 700 ~/.ssh
    - ssh-keyscan $DEPLOY_HOST >> ~/.ssh/known_hosts
  script:
    - ssh $DEPLOY_USER@$DEPLOY_HOST "cd /opt/fastscore && docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY && docker-compose pull && docker-compose up -d"
  only:
    - main
  environment:
    name: production
    url: https://vivatbet.sport
```

**Переменные GitLab** (Settings → CI/CD → Variables):
- `CI_REGISTRY_USER`, `CI_REGISTRY_PASSWORD` — токен Container Registry
- `SSH_PRIVATE_KEY` — приватный ключ для деплоя на сервер (защищённый)
- `DEPLOY_HOST` — IP/домен сервера
- `DEPLOY_USER` — юзер на сервере (с правом запускать docker)

И на сервере в `/opt/fastscore/docker-compose.yml` — те же сервисы, но `image: ${CI_REGISTRY_IMAGE}:latest` вместо локального билда.

---

## Переменные окружения — что куда

| Переменная | Где задать | Зачем |
|---|---|---|
| `API_BASE_URL` | env | URL Marketing API (Vivat Sport) |
| `API_CLIENT_ID` | env | OAuth2 client_id |
| `API_CLIENT_SECRET` | **GitLab secret / Vercel encrypted** | OAuth2 secret — НЕ коммитить |
| `API_REF` | env | Партнёрский тег (282) |
| `NEWS_API_KEY` | env | NewsData.io API key |
| `NEWS_SHEET_ID` | env | ID Google Sheets с статьями |
| `NEXT_PUBLIC_SITE_URL` | env | Production URL для SEO meta |

**`NEXT_PUBLIC_*` переменные** попадают в client bundle (видны в браузере). Не клади туда секреты.

---

## Troubleshooting

### Контейнер падает с `EACCES /app/.next`
Проверь права. В Dockerfile мы создаём `nextjs:1001` юзера — но volumes должны принадлежать ему. Команда:
```bash
sudo chown -R 1001:1001 /path/to/volume
```

### Sheets новости не появляются
1. Открой таблицу — проверь что расшарена "anyone with link"
2. Проверь логи: `docker-compose logs web | grep sheets-news`
3. Кэш 5 мин — после редактирования жди

### Hero видео не работает
Файлы `public/videos/hero.{mp4,webm}` должны быть закоммичены и попасть в Docker-образ. Проверь `.dockerignore` — там не должно быть `public/`.

### API возвращает 401
Проверь `API_CLIENT_SECRET` — он содержит спец-символы (`%`, `*`, `&`). Если задаёшь через `docker run --env`, оберни в кавычки. В `.env.production` файле — не нужно (Docker сам обработает).

### Лимит NewsData.io
200 кредитов/день free → если перевалили, новости перестанут грузиться. На странице новостей останутся только Sheets + промо. Чтобы платный — апгрейд на newsdata.io.
