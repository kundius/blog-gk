# Миграция данных из старого Directus-дампа

Скрипты и порядок переноса данных со старого сайта (Directus, дамп `*.pgsql`)
в новую схему (Prisma/NestJS + S3).

## Подготовка

- Дамп: `bloggk_03_08_2026.pgsql` (полный `pg_dump` из Directus).
- Окружение: контейнеры `blog-gk-postgres-1`, `blog-gk-backend`;
  креды в `.env` / `backend/.env` (`POSTGRES_USER=blog_gk_user`,
  `POSTGRES_DB=blog_gk_db`, `S3_BUCKET`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`,
  `S3_SECRET_ACCESS_KEY`).
- Генерируемые SQL-файлы (`import.sql`, `import_inc.sql`) в `.gitignore`.

## Полный импорт (первый раз / полный сброс)

```bash
# сгенерировать import.sql + files_manifest.csv из дампа
python3 tools/migrate/import.py --dump bloggk_03_08_2026.pgsql

# применить (TRUNCATE + COPY) — заменяет все данные в blog_gk_db
docker exec -i blog-gk-postgres-1 psql -U blog_gk_user -d blog_gk_db -f - < tools/migrate/import.sql
```

## Инкрементальный импорт (новый контент со старого сайта)

Ничего не удаляет: upsert по `id` (`ON CONFLICT DO UPDATE`). Подходит, когда
на старом сайте появляется/правится контент. Удаления и смена alias на старом
сайте не предусмотрены.

```bash
# сгенерировать import_inc.sql + files_manifest_inc.csv из нового дампа
python3 tools/migrate/import.py --incremental --dump <новый_дамп>.pgsql

# применить (без TRUNCATE)
docker exec -i blog-gk-postgres-1 psql -U blog_gk_user -d blog_gk_db -f - < tools/migrate/import_inc.sql
```

## Синк файлов в S3

Догружаемый: сверяет ключи через `ListObjectsV2` и заливает только
отсутствующие (`filename_disk`). Запускать отдельным контейнером (из `docker
exec` процесс умирает). Лог и прогресс — в `tools/migrate/runtime/`.

```bash
# полный импорт: дефолтный манифест /migrate/files_manifest.csv
docker run -d --name blog-gk-sync \
  -v $(pwd)/tools/migrate:/migrate:ro \
  -v $(pwd)/tools/migrate/runtime:/runtime \
  --env-file backend/.env \
  blog-gk-backend node /migrate/sync_files.mjs

# инкремент: указать свежий манифест
docker run -d --name blog-gk-sync \
  -v $(pwd)/tools/migrate:/migrate:ro \
  -v $(pwd)/tools/migrate/runtime:/runtime \
  --env-file backend/.env \
  -e SYNC_MANIFEST=/migrate/files_manifest_inc.csv \
  blog-gk-backend node /migrate/sync_files.mjs
```

Проверка прогресса:

```bash
cat tools/migrate/runtime/sync_progress.txt   # todo / ok / failed / remaining
cat tools/migrate/runtime/sync.log
```

При падении просто перезапустить ту же команду — залитое пропустится.

## Проверка после импорта

```bash
# файл из S3 отдаётся
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3030/files/<filename_disk>

# дерево категорий (3 корня: Кулинария / Статьи / Заметки)
curl -s http://localhost:4040/api/categories/tree | python3 -m json.tool

# не осталось старых URL в контенте
docker exec blog-gk-postgres-1 psql -U blog_gk_user -d blog_gk_db -tA -c \
  "select count(*) from articles where content like '%api.blog-gk.ru/assets%'"
```

## Файлы

- `import.py` — парсер дампа + генератор SQL и манифеста (режимы: полный, `--incremental`).
- `sync_files.mjs` — синк файлов в S3 с resume (env: `SYNC_MANIFEST`, `SYNC_LOG`,
  `SYNC_FAILURES`, `SYNC_PROGRESS`, `SYNC_CONCURRENCY`, `SYNC_MAX_ATTEMPTS`).
- `import.sql`, `import_inc.sql`, `files_manifest*.csv` — генерируемые, в git не попадают.
