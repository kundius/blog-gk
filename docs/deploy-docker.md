# Развёртывание blog-gk в Docker

Docker-сценарий для локальной разработки и тестового окружения.
Прод-развёртывание без Docker (Nginx + PM2 + PostgreSQL) — в [`deploy-vps.md`](./deploy-vps.md).

Миграции БД применяются **только вручную** — контейнеры их сами не запускают.

## 1. Состав

`docker-compose.yml` + `docker-compose.override.yml` поднимают:

| Сервис | Что это | Наружу |
|---|---|---|
| `postgres` | PostgreSQL 16, том `postgres_data` | нет |
| `backend` | NestJS, `nest start --watch`, порт 4000 | через gateway `5022` |
| `site` | Next.js, `npm run dev`, порт 3000 | через gateway `5021` |
| `gateway` | nginx (`nginx/gateway.conf`) | `5021`, `5022` |
| `opencode` | внутренний AI-сервис, порт 5023 | нет |

Gateway работает в одной сети с backend и site: `5021 → site:3000`, `5022 → backend:4000`.

## 2. Окружение

Приложения читают свои `.env`, в compose только `env_file`:

| Файл | Назначение |
|---|---|
| `backend/.env` | NestJS: БД, порт, CORS, JWT, S3, opencode |
| `site/.env` | Next.js: публичные URL, домены картинок, S3, метрика |
| `opencode/.env` | opencode serve: пароль, ключ, конфиг |
| `.env` (корень) | только Docker: пользователь/пароль/имя БД для postgres |

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp site/.env.example site/.env
```

Корневой `.env`:

```dotenv
POSTGRES_USER=blog_gk_user
POSTGRES_PASSWORD=blog_gk_password
POSTGRES_DB=blog_gk_db
```

`backend/.env` — хост БД это имя сервиса `postgres`, порт контейнера 4000:

```dotenv
DATABASE_URL=postgresql://blog_gk_user:blog_gk_password@postgres:5432/blog_gk_db
PORT=4000
CORS_ORIGIN=http://localhost:5021
```

`site/.env`:

```dotenv
NEXT_PUBLIC_CLIENT_URL=http://localhost:5021
NEXT_PUBLIC_API_URL=http://localhost:5022
IMAGE_DOMAINS=localhost
```

Ключи S3 указываются в `backend/.env` и `site/.env`. Без них загрузка и отдача файлов не работают:
site стримит `/files/*` из S3, backend — `/api/files/:id/file`.

## 3. Запуск

```bash
docker compose up -d --build
```

Первый запуск скачивает базовые образы и выполняет `npm ci` — несколько минут.
Дальше `backend` и `site` стартуют в watch/dev-режиме, правки в `src/` подхватываются сразу.

Адреса:

| Что | URL |
|---|---|
| Site | http://localhost:5021 |
| API (префикс `/api`) | http://localhost:5022/api |
| Prisma Studio | `./run.sh studio start` → http://localhost:51212 |

```bash
curl http://localhost:5022/api/articles
```

## 4. Восстановление дампа

```bash
docker compose up -d postgres
docker compose exec -T postgres pg_restore \
  -U blog_gk_user -d blog_gk_db \
  --no-owner --no-privileges --exit-on-error < blog_gk_db.dump
```

Проверка:

```bash
docker compose exec postgres psql -U blog_gk_user -d blog_gk_db -c '\dt'
docker compose exec postgres psql -U blog_gk_user -d blog_gk_db -c 'select count(*) from articles;'
```

## 5. Миграции и сид

```bash
./run.sh deploy    # применить существующие миграции
./run.sh migrate   # создать новую миграцию при разработке схемы
```

Эквивалент:

```bash
docker compose run --rm backend npx prisma migrate deploy
docker compose run --rm backend npx prisma migrate dev
```

Сид:

```bash
docker compose run --rm backend npx prisma db seed
```

Существующие файлы в `backend/prisma/migrations/` не редактируются.

## 6. Проверка и логи

```bash
docker compose ps
docker compose logs -f backend
docker compose logs -f site
docker compose exec -T backend curl -fsS http://127.0.0.1:4000/api/articles >/dev/null && echo ok
```

## 7. Остановка и сброс

```bash
docker compose down       # контейнеры вниз, БД в томе сохраняется
docker compose down -v    # + удалить том postgres_data (данные пропадут)
```

Пересборка после изменения `package.json` или Dockerfile:

```bash
docker compose up -d --build
```

## 8. Обновление кода

```bash
git pull
docker compose up -d --build
./run.sh deploy
```

## 9. Локально без Docker

```bash
# backend
cd backend
npm ci
npx prisma generate
npm run start:dev            # http://localhost:5022

# site
cd site
npm ci
npm run dev -- -p 5021       # http://localhost:5021
```

В `backend/.env` для этого режима хост БД — `localhost`, порт — 5022.
Миграции: `npx prisma migrate deploy` (применить) / `npx prisma migrate dev` (создать).
