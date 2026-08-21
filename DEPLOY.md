# Развёртывание проекта

Два сценария: **локально в Docker** и **на проде под pm2**.

Обязательное правило: **миграции БД применяются только вручную** — вручную через команды ниже.
Никакие контейнеры не применяют миграции сами.

## Окружение (`.env`)

Приложения читают свой `.env`, никакие значения в `docker-compose*.yml` не захардкожены:

| Файл | Назначение |
|------|-----------|
| `backend/.env` | конфиг **NestJS** (читается и при локальном запуске, и в docker через `env_file`). Прод-шаблон: `backend/.env.example` |
| `site/.env` | конфиг **Next.js** (читается на сборке и при запуске; в docker — через `env_file`). Прод-шаблон: `site/.env.example` |
| `opencode/.env` | конфиг **opencode serve** (внутренний сервис; в docker — через `env_file`, в проде — через `env_file` pm2). Шаблона нет: содержит секреты (`OPENCODE_SERVER_PASSWORD`, `OPENCODE_API_KEY`) |
| `.env` (корень репо) | только для docker: учётные данные postgres и pgadmin (`env_file` сервисов). Шаблон: `.env.example` |

NestJS грузит `.env` через `ConfigModule.forRoot` (`backend/src/app.module.ts`),
Next.js — через `next.config.js` (dotenv) и встроенную загрузку `.env`.

Копирование шаблонов для прода (на сервере):
```sh
cp backend/.env.example backend/.env
cp site/.env.example site/.env
cp .env.example .env   # если прод тоже на docker
```

> S3 (AWS / MinIO / Yandex Object Storage) будет добавлен позже. Пока поля `S3_*` пустые —
> загрузка файлов не работает, остальные сущности работают без S3.

---

## 1. Локально (Docker)

Требования: Docker + Docker Compose v2.

### 1.1. Переменные окружения

Каждое приложение читает свой `.env` — в `docker-compose.yml` только `env_file`, без
секций `environment` и без build-args:

- `backend/.env` — для docker укажи `DATABASE_URL` с хостом `postgres` (имя сервиса):
  ```
  DATABASE_URL=postgresql://blog_gk_user:blog_gk_password@postgres:5432/blog_gk_db
  PORT=4000
  ```
  (для локального запуска вне docker — хост `localhost`; на проде в ecosystem.config.js подменяется на 5022)
- `site/.env` — для docker укажи адреса на сервис `backend`:
  ```
  NEXT_PUBLIC_API_URL=http://backend:4000
  NEXT_PUBLIC_CLIENT_URL=http://localhost:5021
  IMAGE_DOMAINS=localhost
  ```
  (для локального запуска вне docker — `localhost`; на проде порт бэкенда 5022, а переменные требуют префикс `NEXT_PUBLIC_`)
- корневой `.env` — учётные данные postgres/pgadmin:
  ```sh
  cp .env.example .env
  ```

### 1.2. Сборка и запуск

```sh
docker compose up -d --build
```

Поднимется: postgres, redis, backend, site, gateway (nginx), pgadmin.

### 1.3. Миграции (вручную!)

Применить уже созданные миграции:
```sh
./run.sh deploy
# эквивалент:
# docker compose run --rm backend npx prisma migrate deploy
```

Создать новую миграцию при разработке схемы (`prisma/schema.prisma`):
```sh
./run.sh migrate
```

### 1.4. Сид (опционально)

```sh
docker compose run --rm backend sh -c "npx prisma db seed"
```

### 1.5. Проверка

```sh
docker compose ps
docker compose logs -f backend
```

Адреса:

| Что                        | URL |
|----------------------------|-----|
| Site (Next.js)             | http://localhost:5021 |
| API (NestJS, префикс /api) | http://localhost:5022/api |
| pgadmin                    | http://localhost:5050 (`admin@blog-gk.dev` / `blog_gk_password`) |
| Prisma Studio               | `./run.sh studio start` → http://localhost:51212 |

Пример запроса к API:
```sh
curl http://localhost:5022/api/articles
```

### 1.6. Остановка

```sh
docker compose down        # контейнеры вниз, данные в volume сохраняются
docker compose down -v     # полная очистка вместе с БД
```

---

## 2. Прод (pm2)

Требования: Linux-сервер, Node.js 22 LTS, PostgreSQL 16, pm2 (`npm i -g pm2`).
Код проекта лежит в `/var/www/blog-gk`.

### 2.1. PostgreSQL

Создать базу и пользователя:
```sql
CREATE USER blog_gk_user WITH PASSWORD 'свой-надёжный-пароль';
CREATE DATABASE blog_gk_db OWNER blog_gk_user;
```

### 2.2. Код

```sh
mkdir -p /var/www
git clone <repo> /var/www/blog-gk   # или rsync
```

### 2.3. Backend (NestJS)

```sh
cd /var/www/blog-gk/backend
npm ci
cp .env.example .env

# заполни .env:
#   DATABASE_URL  → postgresql://blog_gk_user:ПАРОЛЬ@localhost:5432/blog_gk_db
#                   (пароль со спецсимволами URL-кодировать: @ → %40, # → %23, % → %25, / → %2F, ? → %3F)
#   PORT          → 5022        # в примере стоит 4000 (dev), на проде поменяй
#   CORS_ORIGIN   → https://blog-gk.ru (или * )
#   S3_*          → заполни позже

npx prisma generate
npx prisma migrate deploy   # миграции вручную!
npm run build               # → dist/main.js
```

Сид (опционально):
```sh
npx prisma db seed
```

### 2.4. Site (Next.js)

```sh
cd /var/www/blog-gk/site
npm ci
cp .env.example .env

# заполни .env:
#   NEXT_PUBLIC_CLIENT_URL → https://blog-gk.ru
#   NEXT_PUBLIC_API_URL    → https://api.blog-gk.ru (или https://blog-gk.ru/api при одном домене)
#   IMAGE_DOMAINS          → blog-gk.ru,api.blog-gk.ru

npm run build
```

### 2.5. OpenCode serve (внутренний сервис)

Backend обращается к opencode по HTTP (`127.0.0.1:5023`), opencode отвечает текстом.
Сервис не публикуется наружу, инструменты запрещены (`{"permission":{"*":"deny"}}`),
а правила поведения задаёт `opencode/AGENTS.md` (чат-ассистент, без правок кода).
PM2 запускает его из `opencode/` (`cwd`), поэтому opencode видит `AGENTS.md` проекта.

```sh
npm i -g opencode-ai
mkdir -p /var/www/blog-gk/opencode
# создай /var/www/blog-gk/opencode/.env:
#   OPENCODE_SERVER_PASSWORD=<пароль>            # basic auth (username: opencode)
#   OPENCODE_API_KEY=<ключ OpenCode Zen>          # бесплатная модель deepseek-v4-flash-free
#   OPENCODE_CONFIG_CONTENT={"permission":{"*":"deny"}}   # инструменты запрещены
#   OPENCODE_DISABLE_AUTOUPDATE=1
#   OPENCODE_DISABLE_MODELS_FETCH=1
```

В `backend/.env` добавь (тот же пароль):
```
OPENCODE_SERVER_URL=http://127.0.0.1:5023
OPENCODE_SERVER_PASSWORD=<пароль>
```

### 2.6. Запуск через pm2

```sh
cd /var/www/blog-gk
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # автозапуск при перезагрузке сервера (выполнить вывод команды от root)
```

`ecosystem.config.js` читает переменные окружения через `env_file`:
`backend/.env`, `site/.env` и `opencode/.env`. Бэкенд стартует как `node dist/main.js --use-system-ca`,
opencode — как `opencode serve` (слушает только `127.0.0.1:5023`).

### 2.7. Проверка

```sh
pm2 status
pm2 logs blog-gk-backend
curl http://localhost:5022/api/articles
curl http://localhost:5021
curl http://localhost:5022/api/opencode/hello   # тест opencode
```

### 2.8. Обновление

```sh
cd /var/www/blog-gk && git pull

cd backend
npm ci
npx prisma generate
npx prisma migrate deploy   # вручную, если появились новые миграции
npm run build

cd ../site
npm ci
npm run build

cd ..
pm2 reload blog-gk-backend blog-gk-site blog-gk-opencode
```

### 2.9. Nginx / SSL

Проксировать:
- `blog-gk.ru` → `127.0.0.1:5021` (site)
- `api.blog-gk.ru` (или `/api`) → `127.0.0.1:5022` (API)

Выдать сертификаты (Let's Encrypt / certbot).

### 2.10. Примечания

- `node_args: --use-system-ca` требует установленных системных CA-сертификатов,
  включая российский корневой CA (для S3-эндпоинтов с российскими сертификатами):
  ```sh
  curl -o /usr/local/share/ca-certificates/russian-trusted-root-ca.crt \
    https://gu-st.ru/content/lending/russian_trusted_root_ca_pem.crt
  update-ca-certificates
  ```
- Без заполненного `S3_*` загрузка файлов не работает (добавится позже).
- Порт API: 5022, порт site: 5021, порт opencode: 5023 — зафиксированы в `ecosystem.config.js`.

---

## 3. Локально без Docker (разработка)

```sh
# терминал 1 — backend
cd backend
npm ci
npx prisma generate
npm run start:dev          # http://localhost:5022

# терминал 2 — site
cd site
npm ci
npm run dev -- -p 5021     # http://localhost:5021
```

Применение миграций:
```sh
cd backend
npx prisma migrate deploy   # применить существующие
npx prisma migrate dev      # создать новую по текущей схеме
```
