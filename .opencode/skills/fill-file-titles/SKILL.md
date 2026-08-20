---
name: fill-file-titles
description: Use when the user asks to fill empty file titles, optimize image SEO,
  process files with null titles, or update alt text. Triggers on "заполни пустые
  title", "обнови alt", "SEO изображений", "заполни описания файлов".
---

# Rules for generating file titles

You receive `empty-titles-context.json` with files that have null title.
For each entry, generate a title in Russian.

## Format by context.type

| Type | Title format |
|---|---|
| `thumbnail` | `{entityName}` |
| `album_photo` | `Фото из альбома «{entityName}»` |
| `content_step` | `{entityName}: {short description of image based on rawContext}` |
| `content_inline` | `{entityName}: {short description of image based on rawContext}` |

## Constraints

- Language: Russian
- Length: 3-15 words, max 125 characters
- If rawContext contains text — use it to describe the image
- If rawContext is null — use entityName
- Never use the old alt text as title

## Output

Write `applied-titles.json`:

```json
[
  { "fileId": "...", "title": "...", "articleId": "...", "filenameDisk": "..." }
]
```
