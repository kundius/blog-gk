---
name: fill-file-titles
description: Use when the user asks to fill empty file titles, optimize image SEO,
  process files with null titles, or update alt text. Triggers on "заполни пустые
  title", "обнови alt", "SEO изображений", "заполни описания файлов".
---

# Fill Empty File Titles

Fills File.title (null → SEO-optimized Russian description) and updates
alt attributes in article HTML content.

## Invocation

The user just invokes this skill. The AI handles everything autonomously:
finds files, generates titles, applies changes. No manual script execution needed.

## Environment Detection

Before running scripts, detect the environment:

```bash
if docker compose ps >/dev/null 2>&1; then
  EXEC="docker compose exec -T backend sh -c"
  CP_FROM="docker cp backend:/app/"
  CP_TO="docker cp"
elif podman compose ps >/dev/null 2>&1; then
  EXEC="podman compose exec -T backend sh -c"
  CP_FROM="podman cp backend:/app/"
  CP_TO="podman cp"
elif command -v npx >/dev/null 2>&1 && [ -f backend/prisma/schema.prisma ]; then
  DIRECT=true
fi
```

- Docker/Podman: `$EXEC "cd /app && npx tsx prisma/script.ts"`
- Direct (Node.js on host): `cd backend && npx tsx prisma/script.ts`

## Workflow

### Step 1: Find files with empty titles

```bash
# Docker/Podman:
$EXEC "cd /app && npx tsx prisma/find-empty-titles.ts"
$CP_FROM empty-titles-context.json ./

# Direct:
cd backend && npx tsx prisma/find-empty-titles.ts
# output: ../empty-titles-context.json
```

### Step 2: Read JSON, generate titles

Read `empty-titles-context.json`. For each entry:

| Context type | Title format |
|---|---|
| `thumbnail` | `{entityName}` |
| `album_photo` | `Фото из альбома «{albumName}»` |
| `content_step` | `{articleName}: {AI step summary}` |
| `content_inline` | `{articleName}: {AI text summary}` |

**Title rules:**
- Russian language
- 3-15 words, max 125-150 characters
- If over limit, shorten with AI preserving meaning
- For content images: concise summary of surrounding text

### Step 3: Write results, apply

Write `applied-titles.json`:
```json
[
  { "fileId": "...", "title": "...", "articleId": "...", "filenameDisk": "..." }
]
```

```bash
# Docker/Podman:
$CP_TO applied-titles.json backend:/app/applied-titles.json
$EXEC "cd /app && npx tsx prisma/apply-file-titles.ts"

# Direct:
cd backend && npx tsx prisma/apply-file-titles.ts
```

### Step 4: Repeat or verify

- If 100 files processed → run find again (more may remain)
- If 0 files found → done
- Show final report to user

### Step 5: Report

Tell user:
- How many files got titles
- Examples of generated titles
- How many alt attributes updated in HTML
