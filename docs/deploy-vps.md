# Развёртывание blog-gk на VPS (Nginx + PM2 + PostgreSQL)

Упрощённая инструкция под этот проект: **без Docker на проде**.
Стек: Nginx, Node.js 22 LTS, PM2, PostgreSQL 16+, Certbot.

Локальная разработка и Docker-сценарий — в корневом [`DEPLOY.md`](../DEPLOY.md).

- TLS: отдельный сертификат на `blog-gk.ru` (+ `www`) и `api.blog-gk.ru`.
- Медиа хранится в S3 (Beget) и стримится через backend/site — файлового сервера нет.
- Миграции БД применяются **только вручную** и только после бэкапа.

## 1. Целевая схема

| Домен | Назначение |
|---|---|
| `blog-gk.ru` | Next.js `127.0.0.1:5021` |
| `www.blog-gk.ru` | 301 → `blog-gk.ru` |
| `api.blog-gk.ru` | NestJS `127.0.0.1:5022` (глобальный префикс `/api`) |
| — | opencode `127.0.0.1:5023` (внутренний, наружу не публикуется) |
| — | PostgreSQL `127.0.0.1:5432` |

Порты зафиксированы в `ecosystem.config.js` и `nginx/gateway.conf`:

| Сервис | Порт | PM2-процесс |
|---|---|---|
| site (Next.js) | 5021 | `blog-gk-site` |
| backend (NestJS) | 5022 | `blog-gk-backend` |
| opencode | 5023 | `blog-gk-opencode` |

## 2. Требования

- Ubuntu 24.04/26.04, 2+ vCPU, 4+ ГБ RAM, 20+ ГБ диска.
- Публичный IPv4 (при NAT нужен проброс TCP 80/443).
- Доступ по SSH-ключу, пользователь `deploy` с `sudo`.

## 3. DNS

A-записи на IP сервера:

```text
blog-gk.ru
www.blog-gk.ru
api.blog-gk.ru
```

Если IPv6 не используется — убедитесь, что старых AAAA-записей нет. При Cloudflare до окончания настройки — **DNS only** (оранжевый прокси потребует настройки `real_ip`).

Проверка:

```bash
for d in blog-gk.ru www.blog-gk.ru api.blog-gk.ru; do
  echo "$d -> $(dig +short "$d" A | tr '\n' ' ')"
done
```

## 4. Базовая настройка сервера

```bash
sudo apt update && sudo apt full-upgrade -y
sudo hostnamectl set-hostname blog-gk-prod
sudo timedatectl set-timezone Europe/Moscow
sudo timedatectl set-ntp true
```

Swap, если RAM меньше 8 ГБ:

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

Пользователь, SSH и firewall — по стандартной схеме: отдельный `deploy` с ключом, `PermitRootLogin no`,
`PasswordAuthentication no`, UFW `22/80/443`, fail2ban, unattended-upgrades.

Минимальный UFW:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose
```

## 5. Пакеты

```bash
sudo apt install -y nginx postgresql postgresql-client certbot \
  git curl wget gnupg ca-certificates ufw fail2ban \
  unattended-upgrades logrotate build-essential python3 make g++ \
  htop jq unzip
```

Node.js 22 LTS:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # v22.x
npm -v
```

PM2:

```bash
sudo npm install -g pm2
```

Российский корневой CA — обязателен для S3 Beget (backend запускается с `--use-system-ca`):

```bash
sudo curl -sSf -o /usr/local/share/ca-certificates/russian-trusted-root-ca.crt \
  https://gu-st.ru/content/lending/russian_trusted_root_ca_pem.crt
sudo update-ca-certificates
```

## 6. PostgreSQL

### Версия

Пакетов `postgresql-16` / `postgresql-client-16` может не быть в репозиториях Ubuntu:
версия зависит от релиза ОС (24.04 — 16, 25.10/26.04 — 17/18). Ставьте дефолтный пакет:

```bash
sudo apt install -y postgresql postgresql-client
psql --version
```

Дамп снят через `pg_dump` 16, а `pg_restore` новых мажорных версий восстанавливает дампы
старых версий — конвертация не нужна. Проверьте кластер и сервис:

```bash
pg_lsclusters
sudo systemctl status postgresql --no-pager
```

Если нужна именно версия 16 (например, чтобы совпадала с продом), подключите PGDG:

```bash
sudo install -d /usr/share/postgresql-common/pgdg
sudo curl -fsSL -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc \
  https://www.postgresql.org/media/keys/ACCC4CF8.asc
. /etc/os-release
echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt ${VERSION_CODENAME}-pgdg main" \
  | sudo tee /etc/apt/sources.list.d/pgdg.list
sudo apt update
sudo apt install -y postgresql-16 postgresql-client-16
```

Создать пользователя и базу (пароль — свой, длинный):

```bash
sudo -u postgres psql <<'SQL'
CREATE USER blog_gk_user WITH PASSWORD 'STRONG_DB_PASSWORD';
CREATE DATABASE blog_gk_db OWNER blog_gk_user;
SQL
```

PostgreSQL слушает только `127.0.0.1` (дефолт Ubuntu) — наружу порт не открывать.

### Восстановление из дампа

Дампы в формате `pg_dump -Fc` (custom) восстанавливаются от суперпользователя, чтобы не зависеть от владельцев объектов:

```bash
sudo -u postgres pg_restore -d blog_gk_db \
  --no-owner --no-privileges --exit-on-error -v /path/to/blog_gk_db.dump
```

Проверка:

```bash
sudo -u postgres psql -d blog_gk_db -c '\dt'
sudo -u postgres psql -d blog_gk_db -c 'select count(*) from articles;'
sudo -u postgres psql -d blog_gk_db -c 'select migration_name, finished_at from _prisma_migrations order by started_at desc limit 5;'
```

Если таблица `_prisma_migrations` есть — после установки зависимостей применяйте только новые миграции
(`npx prisma migrate deploy`). Если её нет — сначала сверьте схему, не запускайте миграции вслепую.

## 7. Код и каталоги

Все команды `git`, `npm`, `pm2` и бэкапы выполняются от `deploy`, без `sudo`:

```bash
git clone <repo> /home/deploy/blog-gk-src
sudo mv /home/deploy/blog-gk-src /var/www/blog-gk
sudo chown -R deploy:deploy /var/www/blog-gk
```

`sudo` нужен только для `mv` в `/var/www`.

### `.env`

Приложения читают свои файлы (см. таблицу в `DEPLOY.md`):

| Файл | Назначение |
|---|---|
| `backend/.env` | NestJS: БД, порт, CORS, JWT, S3, opencode |
| `site/.env` | Next.js: публичные URL, домены картинок, S3, метрика |
| `opencode/.env` | внутренний сервис: пароль, ключ, конфиг |

Корневой `.env` на проде **не нужен** — он только для Docker (postgres/pgadmin).

`backend/.env`:

```dotenv
DATABASE_URL=postgresql://blog_gk_user:STRONG_DB_PASSWORD@localhost:5432/blog_gk_db
PORT=5022
CORS_ORIGIN=https://blog-gk.ru
JWT_SECRET=<длинная случайная строка>
JWT_EXPIRES_IN=7d

S3_ENDPOINT=https://s3.ru1.storage.beget.cloud
S3_REGION=ru-1a
S3_BUCKET=<bucket>
S3_ACCESS_KEY_ID=<key>
S3_SECRET_ACCESS_KEY=<secret>
S3_FORCE_PATH_STYLE=true

OPENCODE_SERVER_URL=http://127.0.0.1:5023
OPENCODE_SERVER_PASSWORD=<пароль>
OPENCODE_MODELS=<список моделей>

AI_STUDIO_API_KEY=<key>
AI_STUDIO_FOLDER_ID=<folder>
```

Пароль в `DATABASE_URL` со спецсимволами URL-кодировать: `@` → `%40`, `#` → `%23`, `%` → `%25`, `/` → `%2F`, `?` → `%3F`.

`site/.env`:

```dotenv
NEXT_PUBLIC_CLIENT_URL=https://blog-gk.ru
NEXT_PUBLIC_API_URL=https://api.blog-gk.ru
IMAGE_DOMAINS=blog-gk.ru,api.blog-gk.ru

S3_ENDPOINT=https://s3.ru1.storage.beget.cloud
S3_REGION=ru-1a
S3_BUCKET=<bucket>
S3_ACCESS_KEY_ID=<key>
S3_SECRET_ACCESS_KEY=<secret>
S3_FORCE_PATH_STYLE=true

NEXT_PUBLIC_METRIKA_ID=<id>
```

`opencode/.env`:

```dotenv
OPENCODE_SERVER_PASSWORD=<пароль, тот же, что в backend>
OPENCODE_API_KEY=<ключ OpenCode Zen>
OPENCODE_CONFIG_CONTENT={"permission":{"*":"deny","skill":"allow","read":{"*":"deny",".opencode/skills/**":"allow"}}}
OPENCODE_DISABLE_AUTOUPDATE=1
OPENCODE_DISABLE_MODELS_FETCH=1
AITUNNEL_API_KEY=<key>
```

Права:

```bash
chmod 600 /var/www/blog-gk/backend/.env /var/www/blog-gk/site/.env /var/www/blog-gk/opencode/.env
```

## 8. Сборка и миграции

От пользователя `deploy`:

```bash
cd /var/www/blog-gk/backend
npm ci
npx prisma generate
npm run build

cd /var/www/blog-gk/site
npm ci
npm run build
```

При нехватке памяти на сборке Next.js:

```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

Миграции — **вручную**, после бэкапа:

```bash
cd /var/www/blog-gk/backend
npx prisma migrate deploy
```

`NEXT_PUBLIC_*` вшиваются в бандл на этапе `next build` — после их изменения пересборка site обязательна.

opencode ставится глобально (один раз):

```bash
npm i -g opencode-ai
```

## 9. PM2

Конфиг уже в репозитории: `ecosystem.config.js` (порты, `cwd`, загрузка `.env`, `--use-system-ca`).

```bash
cd /var/www/blog-gk
pm2 start ecosystem.config.js
pm2 save

sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u deploy --hp /home/deploy
sudo systemctl enable pm2-deploy
sudo systemctl status pm2-deploy --no-pager
```

Логи:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 50M
pm2 set pm2-logrotate:retain 14
pm2 set pm2-logrotate:compress true
```

Backend запускать в `fork`, не в `cluster` — иначе cron `@nestjs/schedule` задублируется.

## 10. Nginx и TLS

### 10.1. Подготовка

```bash
sudo rm -f /etc/nginx/sites-enabled/default
```

`/etc/nginx/conf.d/blog-gk-common.conf`:

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

client_max_body_size 20m;
client_body_timeout 60s;
client_header_timeout 60s;
send_timeout 60s;
keepalive_timeout 65;
server_names_hash_bucket_size 64;
```

`server_tokens`, `ssl_protocols`, `ssl_prefer_server_ciphers`, `ssl_session_*` задаются один раз в `/etc/nginx/nginx.conf`.

### 10.2. HTTP (ACME + редирект)

`/etc/nginx/sites-available/blog-gk-http.conf`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name blog-gk.ru www.blog-gk.ru api.blog-gk.ru;

    location ^~ /.well-known/acme-challenge/ {
        root /var/www/html;
        default_type text/plain;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}
```

```bash
sudo mkdir -p /var/www/html/.well-known/acme-challenge
sudo chown -R www-data:www-data /var/www/html
sudo ln -s /etc/nginx/sites-available/blog-gk-http.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 10.3. Сертификаты

```bash
sudo certbot certonly --webroot -w /var/www/html \
  -d blog-gk.ru -d www.blog-gk.ru \
  --cert-name blog-gk.ru \
  --agree-tos -m admin@blog-gk.ru --no-eff-email

sudo certbot certonly --webroot -w /var/www/html \
  -d api.blog-gk.ru \
  --cert-name api.blog-gk.ru \
  --agree-tos -m admin@blog-gk.ru --no-eff-email
```

Повторные выпуски проверять через `--staging`.

### 10.4. HTTPS

Сниппеты:

```bash
sudo tee /etc/nginx/snippets/ssl-blog-gk.conf >/dev/null <<'EOF'
ssl_certificate     /etc/letsencrypt/live/blog-gk.ru/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/blog-gk.ru/privkey.pem;
EOF

sudo tee /etc/nginx/snippets/ssl-api-blog-gk.conf >/dev/null <<'EOF'
ssl_certificate     /etc/letsencrypt/live/api.blog-gk.ru/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/api.blog-gk.ru/privkey.pem;
EOF

sudo tee /etc/nginx/snippets/blog-gk-headers.conf >/dev/null <<'EOF'
add_header Strict-Transport-Security "max-age=31536000" always;
add_header X-Content-Type-Options nosniff always;
add_header X-Frame-Options SAMEORIGIN always;
add_header Referrer-Policy strict-origin-when-cross-origin always;
EOF
```

`/etc/nginx/sites-available/blog-gk.conf`:

```nginx
# www → без www
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name www.blog-gk.ru;

    include snippets/ssl-blog-gk.conf;
    include snippets/blog-gk-headers.conf;

    return 301 https://blog-gk.ru$request_uri;
}

# site
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name blog-gk.ru;

    include snippets/ssl-blog-gk.conf;
    include snippets/blog-gk-headers.conf;

    location / {
        proxy_pass http://127.0.0.1:5021;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_read_timeout 3600s;
    }
}

# API
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name api.blog-gk.ru;

    include snippets/ssl-api-blog-gk.conf;
    include snippets/blog-gk-headers.conf;

    client_max_body_size 20m;
    proxy_connect_timeout 75s;
    proxy_read_timeout 3600s;
    proxy_send_timeout 3600s;

    location / {
        proxy_pass http://127.0.0.1:5022;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";
    }
}
```

`client_max_body_size 20m` соответствует лимиту загрузки в backend (`Multer`, 20 МБ).
`proxy_read_timeout 3600s` нужен для длительных AI-запросов через opencode.

Включение:

```bash
sudo ln -s /etc/nginx/sites-available/blog-gk.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Версия Nginx:

- `>= 1.25.1` — `listen 443 ssl;` + отдельная строка `http2 on;` (как выше).
- `< 1.25.1` — `listen 443 ssl http2;` без директивы `http2`.

Продление:

```bash
sudo tee /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh >/dev/null <<'EOF'
#!/bin/sh
systemctl reload nginx
EOF
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
sudo certbot renew --dry-run
```

## 11. Проверка

```bash
sudo systemctl status nginx postgresql fail2ban pm2-deploy --no-pager
pm2 status

curl -I https://blog-gk.ru
curl -I https://www.blog-gk.ru            # ожидается 301
curl -I https://api.blog-gk.ru/api/articles
curl -s https://api.blog-gk.ru/api/articles?limit=1 | head -c 200
curl -s https://api.blog-gk.ru/api/opencode/hello

sudo ss -tulpn | grep -E ':(5021|5022|5023|5432)'
sudo ufw status
```

HTTP/2 и сертификаты:

```bash
curl -sI --http2 https://blog-gk.ru | head -1
curl -sI --http2 https://api.blog-gk.ru/api/articles | head -1

for d in blog-gk.ru api.blog-gk.ru; do
  echo "=== $d ==="
  openssl s_client -connect "$d:443" -servername "$d" </dev/null 2>/dev/null \
    | openssl x509 -noout -subject -issuer -dates -ext subjectAltName
done
```

Функционально: открыть главную, статью, `/admin`, проверить загрузку/отдачу картинки (`/files/...`).

## 12. Медиа (S3)

- Бакет Beget должен содержать объекты с ключами из `files.filename_disk` (`processed/...`, `<uuid>..jpg`).
- Site отдаёт файлы через rewrite `/files/*` → `/api/files/*` и стримит их из S3; backend — через `/api/files/:id/file`.
- Если бакет пустой, записи в БД остаются, но картинки отдают 404/502.
- Ключи S3 должны совпадать в `backend/.env` и `site/.env`.

## 13. Бэкапы

Скрипт `/usr/local/bin/blog-gk-backup.sh`:

```bash
#!/bin/sh
set -e
BACKUP_DIR=/var/backups/blog-gk
mkdir -p "$BACKUP_DIR"
pg_dump -U blog_gk_user -Fc blog_gk_db > "$BACKUP_DIR/db_$(date +%F_%H-%M).dump"
find "$BACKUP_DIR" -name 'db_*.dump' -mtime +14 -delete
```

Cron (`/etc/cron.d/blog-gk-backup`):

```cron
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
0 2 * * * deploy /usr/local/bin/blog-gk-backup.sh >> /home/deploy/backup.log 2>&1
```

Медиа в S3 — версионирование бакета или отдельная offsite-копия. Восстановление проверять раз в месяц.

## 14. Обновление

```bash
cd /var/www/blog-gk
git pull --ff-only

cd backend
npm ci
npx prisma generate
npx prisma migrate deploy   # только после бэкапа
npm run build

cd ../site
npm ci
npm run build

cd ..
pm2 reload ecosystem.config.js --update-env
pm2 save
```

Если менялись только `NEXT_PUBLIC_*` — пересборка site обязательна. Если только API — достаточно
`pm2 reload blog-gk-backend`.

Перед обновлением:

```bash
sudo -u postgres pg_dump -Fc blog_gk_db > /var/backups/blog-gk/predeploy_$(date +%F).dump
```

## 15. Чек-лист безопасности

- root SSH и вход по паролю закрыты; UFW: только 22/80/443.
- PostgreSQL слушает только `127.0.0.1`, наружу не опубликован.
- `.env` — права `600`, секреты не в git.
- opencode (5023) и API-порты слушают `127.0.0.1`.
- HSTS включать после проверки всех доменов.
- `certbot renew --dry-run` успешен.
- Бэкап БД по cron, восстановление проверено.
- Российский CA установлен, S3-картинки отдаются.
- Миграции применяются только вручную.

## 16. Что уточнить перед выполнением

1. IP сервера и SSH-доступ.
2. DNS-провайдер и использование Cloudflare.
3. Email для Let's Encrypt.
4. Путь к дампу БД и актуальные S3-креды.
5. Нужен ли `www.blog-gk.ru` (сейчас предусмотрен редирект).
6. RAM/CPU/диск сервера.
7. Разрешён ли исходящий трафик к S3, AI-провайдерам и Let's Encrypt.
