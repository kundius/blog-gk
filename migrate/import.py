#!/usr/bin/env python3
"""Migrate old Directus dump into the new schema.

Full mode (default): TRUNCATE + COPY, replaces all data (first-time import).
Incremental mode (--incremental): upserts rows from the dump without deleting
anything (ON CONFLICT (id) DO UPDATE). Meant for merging new/edited content
from a newer dump into an already-migrated database. Records deleted or
renamed on the old site are NOT removed here (old site never deletes).

Both modes write a SQL file (COPY ... FROM stdin) plus a file manifest for the
S3 sync step. Fields are kept in pg_dump COPY escaping (never unescaped), so
the output remains valid COPY text for psql.
"""
import argparse
import csv
import re
import sys
from pathlib import Path
from urllib.parse import unquote

N = '\\N'

ASSETS_RE = re.compile(r'(https?://api\.blog-gk\.ru)?/assets/([0-9a-fA-F-]{36})')
FILES_RE = re.compile(r'(https?://api\.blog-gk\.ru)?/files/([^"\s<>]+)')
REL_FILES_RE = re.compile(r'(?<!\/)files/([^"\s<>][^"]*)')


def parse_dump(path):
    text = path.read_text(encoding='utf-8', errors='replace')
    lines = text.split('\n')
    blocks = {}
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.startswith('COPY public.') and ' FROM stdin;' in line:
            name = line.split(' ')[1].replace('public.', '')
            cols = [c.strip() for c in line[line.index('(') + 1:line.index(') FROM stdin;')].split(',')]
            j = i + 1
            rows = []
            while j < len(lines) and lines[j] != '\\.':
                rows.append(lines[j].split('\t'))
                j += 1
            blocks[name] = (cols, rows)
            i = j + 1
        else:
            i += 1
    return blocks


def emit_full(out, table, cols, rows):
    out.write(f'COPY public.{table} ({", ".join(cols)}) FROM stdin;\n')
    for row in rows:
        out.write('\t'.join(row))
        out.write('\n')
    out.write('\\.\n')


def emit_inc(out, table, cols, rows, key='id'):
    staging = '_staging_' + table
    out.write(f'CREATE TEMP TABLE {staging} (LIKE public.{table}) ON COMMIT DROP;\n')
    out.write(f'COPY {staging} ({", ".join(cols)}) FROM stdin;\n')
    for row in rows:
        out.write('\t'.join(row))
        out.write('\n')
    out.write('\\.\n')
    set_cols = [c for c in cols if c != key]
    if set_cols:
        set_clause = ', '.join(f'{c} = EXCLUDED.{c}' for c in set_cols)
        out.write(f'INSERT INTO public.{table} ({", ".join(cols)}) '
                  f'SELECT {", ".join(cols)} FROM {staging} ON CONFLICT ({key}) DO UPDATE SET {set_clause};\n')
    else:
        out.write(f'INSERT INTO public.{table} ({", ".join(cols)}) '
                  f'SELECT {", ".join(cols)} FROM {staging} ON CONFLICT ({key}) DO NOTHING;\n')
    out.write('\n')


def emit(out, table, cols, rows, incremental=False):
    if incremental:
        emit_inc(out, table, cols, rows)
    else:
        emit_full(out, table, cols, rows)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dump', default='/home/kundius/blog-gk/bloggk_03_08_2026.pgsql',
                    help='source pg_dump file')
    ap.add_argument('--incremental', action='store_true',
                    help='upsert into existing data instead of TRUNCATE+COPY')
    ap.add_argument('--out', default=None, help='output SQL path')
    ap.add_argument('--manifest', default=None, help='output manifest path')
    args = ap.parse_args()

    DUMP = Path(args.dump)
    INCREMENTAL = args.incremental
    OUT = Path(args.out) if args.out else Path(
        '/home/kundius/blog-gk/migrate/import_inc.sql' if INCREMENTAL
        else '/home/kundius/blog-gk/migrate/import.sql')
    MANIFEST = Path(args.manifest) if args.manifest else Path(
        '/home/kundius/blog-gk/migrate/files_manifest_inc.csv' if INCREMENTAL
        else '/home/kundius/blog-gk/migrate/files_manifest.csv')

    blocks = parse_dump(DUMP)
    print('parsed tables:', sorted(blocks))

    def rows_of(name):
        return blocks[name][1]

    def idx_of(name, col):
        return blocks[name][0].index(col)

    files_cols = blocks['directus_files'][0]
    fi = {c: i for i, c in enumerate(files_cols)}
    file_rows = rows_of('directus_files')
    file_id_to_disk = {r[fi['id']]: r[fi['filename_disk']] for r in file_rows}
    file_id_to_download = {r[fi['id']]: r[fi['filename_download']] for r in file_rows}
    download_to_disk = {r[fi['filename_download']]: r[fi['filename_disk']] for r in file_rows}
    disk_set = set(file_id_to_disk.values())

    n_null_disk = sum(1 for r in file_rows if r[fi['filename_disk']] == N)
    print(f'directus_files: {len(file_rows)} rows, null filename_disk: {n_null_disk}')

    def rewrite_content(field):
        if field == N:
            return field

        def repl_assets(m):
            uuid = m.group(2)
            disk = file_id_to_disk.get(uuid)
            if disk:
                return '/files/' + disk
            return m.group(0)

        field = ASSETS_RE.sub(repl_assets, field)

        def repl_files(m):
            name = m.group(2)
            name_plain = unquote(name)
            disk = download_to_disk.get(name) or download_to_disk.get(name_plain)
            if not disk and name in disk_set:
                disk = name
            if disk:
                return '/files/' + disk
            return m.group(0)

        field = FILES_RE.sub(repl_files, field)

        def repl_rel_files(m):
            name = m.group(1)
            disk = download_to_disk.get(name) or download_to_disk.get(unquote(name))
            if disk:
                return '/files/' + disk
            return m.group(0)

        field = REL_FILES_RE.sub(repl_rel_files, field)
        return field

    # --- categories: sections become roots, categories become children
    sec_cols = blocks['sections'][0]
    si = {c: i for i, c in enumerate(sec_cols)}
    cat_rows = []
    for r in rows_of('sections'):
        cat_rows.append([
            r[si['id']], r[si['name']], rewrite_content(r[si['content']]), r[si['alias']],
            r[si['seo_title']], r[si['seo_keywords']], r[si['seo_description']], N,
        ])
    cat_cols = blocks['categories'][0]
    ci = {c: i for i, c in enumerate(cat_cols)}
    for r in rows_of('categories'):
        cat_rows.append([
            r[ci['id']], r[ci['name']], rewrite_content(r[ci['content']]), r[ci['alias']],
            r[ci['seo_title']], r[ci['seo_keywords']], r[ci['seo_description']], r[ci['section']],
        ])

    # --- files
    file_rows_out = []
    for r in file_rows:
        created = r[fi['uploaded_on']]
        if created == N:
            created = '1970-01-01 00:00:00+00'
        file_rows_out.append([
            r[fi['id']], r[fi['filename_disk']],
            r[fi['filename_download']] if r[fi['filename_download']] != N else '',
            r[fi['title']], r[fi['type']], r[fi['filesize']], r[fi['width']], r[fi['height']],
            r[fi['description']], created, r[fi['blurhash']],
        ])

    # --- articles
    acols = blocks['articles'][0]
    ai = {c: i for i, c in enumerate(acols)}
    article_rows = []
    for r in rows_of('articles'):
        article_rows.append([
            r[ai['id']], r[ai['status']], r[ai['date_created']], r[ai['date_updated']],
            r[ai['alias']], r[ai['name']], rewrite_content(r[ai['content']]),
            r[ai['excerpt']], r[ai['category']], r[ai['thumbnail']], r[ai['ingredients']],
            r[ai['portion_count']], r[ai['cooking_time']], r[ai['comments_count']],
            r[ai['hits_count']], r[ai['likes_count']],
            r[ai['seo_title']], r[ai['seo_keywords']], r[ai['seo_description']],
        ])

    # --- albums
    alcols = blocks['albums'][0]
    ali = {c: i for i, c in enumerate(alcols)}
    album_rows = []
    for r in rows_of('albums'):
        album_rows.append([
            r[ali['id']], r[ali['name']], r[ali['alias']], r[ali['thumbnail']],
            r[ali['seo_title']], r[ali['seo_keywords']], r[ali['seo_description']],
        ])
    album_ids = {r[0] for r in album_rows}
    file_ids = set(file_id_to_disk)

    # --- albums_files (only valid links)
    afcols = blocks['albums_directus_files'][0]
    afi = {c: i for i, c in enumerate(afcols)}
    albumfile_rows = []
    for r in rows_of('albums_directus_files'):
        a, f, s = r[afi['album']], r[afi['file']], r[afi['sort']]
        if a != N and f != N and a in album_ids and f in file_ids:
            albumfile_rows.append([a, f, s])

    # --- comments (+threads), drop orphans
    article_ids = {r[0] for r in article_rows}
    tcols = blocks['comments_threads'][0]
    ti = {c: i for i, c in enumerate(tcols)}
    thread_article = {}
    orphan_comments = set()
    for r in rows_of('comments_threads'):
        item = r[ti['item']]
        if item in article_ids:
            thread_article[r[ti['comment']]] = item
        else:
            orphan_comments.add(r[ti['comment']])
    print(f'orphan comments dropped: {len(orphan_comments)}')

    ccols = blocks['comments'][0]
    cmi = {c: i for i, c in enumerate(ccols)}
    comment_rows = []
    for r in rows_of('comments'):
        cid = r[cmi['id']]
        if cid in orphan_comments:
            continue
        parent = r[cmi['parent']]
        if parent in orphan_comments:
            parent = N
        article = thread_article.get(cid, N)
        comment_rows.append([
            cid, r[cmi['status']], r[cmi['date_created']], r[cmi['date_updated']],
            r[cmi['content']], r[cmi['raw']], r[cmi['author_name']], r[cmi['author_email']],
            parent, article,
        ])

    # --- pages (rewrite content)
    pcols = blocks['pages'][0]
    pi = {c: i for i, c in enumerate(pcols)}
    page_rows = []
    for r in rows_of('pages'):
        page_rows.append([
            r[pi['id']], r[pi['name']], rewrite_content(r[pi['content']]), r[pi['alias']],
            r[pi['seo_title']], r[pi['seo_keywords']], r[pi['seo_description']],
        ])

    # --- tags
    tcols2 = blocks['tags'][0]
    ti2 = {c: i for i, c in enumerate(tcols2)}
    tag_rows = [[r[ti2['id']], r[ti2['name']], r[ti2['alias']]] for r in rows_of('tags')]

    # --- subscribers (dedupe by email, keep first)
    scol = blocks['subscribers'][0]
    ssi = {c: i for i, c in enumerate(scol)}
    seen = set()
    subscriber_rows = []
    for r in rows_of('subscribers'):
        email = r[ssi['email']]
        if email in seen:
            continue
        seen.add(email)
        subscriber_rows.append([r[ssi['id']], r[ssi['date_created']], email])

    with OUT.open('w', encoding='utf-8') as out:
        if INCREMENTAL:
            out.write('\\set ON_ERROR_STOP on\nBEGIN;\n\n')
        else:
            out.write('TRUNCATE public.files, public.articles_files, public.albums_files, '
                      'public.articles, public.albums, public.categories, public.comments, '
                      'public.tags, public.pages, public.subscribers RESTART IDENTITY CASCADE;\n\n')
        emit(out, 'categories',
             ['id', 'name', 'content', 'alias', 'seo_title', 'seo_keywords', 'seo_description', 'parent'],
             cat_rows, INCREMENTAL)
        emit(out, 'files',
             ['id', 'filename_disk', 'filename_download', 'title', 'type', 'filesize',
              'width', 'height', 'description', 'created_at', 'blurhash'],
             file_rows_out, INCREMENTAL)
        emit(out, 'articles',
             ['id', 'status', 'date_created', 'date_updated', 'alias', 'name', 'content',
              'excerpt', 'category', 'thumbnail', 'ingredients', 'portion_count',
              'cooking_time', 'comments_count', 'hits_count', 'likes_count',
              'seo_title', 'seo_keywords', 'seo_description'],
             article_rows, INCREMENTAL)
        emit(out, 'albums', ['id', 'name', 'alias', 'thumbnail', 'seo_title', 'seo_keywords', 'seo_description'],
             album_rows, INCREMENTAL)
        if INCREMENTAL:
            stg = '_staging_albums_files'
            out.write(f'CREATE TEMP TABLE {stg} (album uuid, file uuid, sort integer) ON COMMIT DROP;\n')
            out.write(f'COPY {stg} (album, file, sort) FROM stdin;\n')
            for row in albumfile_rows:
                out.write('\t'.join(row) + '\n')
            out.write('\\.\n')
            out.write(f'DELETE FROM public.albums_files WHERE album IN (SELECT album FROM {stg});\n')
            out.write(f'INSERT INTO public.albums_files (album, file, sort) '
                      f'SELECT album, file, sort FROM {stg};\n\n')
        else:
            emit_full(out, 'albums_files', ['album', 'file', 'sort'], albumfile_rows)
        emit(out, 'comments',
             ['id', 'status', 'date_created', 'date_updated', 'content', 'raw',
              'author_name', 'author_email', 'parent', 'article'],
             comment_rows, INCREMENTAL)
        emit(out, 'pages', ['id', 'name', 'content', 'alias', 'seo_title', 'seo_keywords', 'seo_description'],
             page_rows, INCREMENTAL)
        emit(out, 'tags', ['id', 'name', 'alias'], tag_rows, INCREMENTAL)
        emit(out, 'subscribers', ['id', 'date_created', 'email'], subscriber_rows, INCREMENTAL)
        if INCREMENTAL:
            out.write('COMMIT;\n')

    with MANIFEST.open('w', encoding='utf-8', newline='') as mf:
        w = csv.writer(mf)
        w.writerow(['id', 'filename_disk', 'type'])
        for r in file_rows:
            if r[fi['filename_disk']] != N:
                w.writerow([r[fi['id']], r[fi['filename_disk']], r[fi['type']]])

    print(f'categories: {len(cat_rows)} (3 roots + {len(cat_rows) - 3} children)')
    print(f'files: {len(file_rows_out)}')
    print(f'articles: {len(article_rows)}')
    print(f'albums: {len(album_rows)}, albums_files: {len(albumfile_rows)}')
    print(f'comments: {len(comment_rows)}')
    print(f'pages: {len(page_rows)}')
    print(f'tags: {len(tag_rows)}')
    print(f'subscribers: {len(subscriber_rows)}')
    print(f'wrote {OUT} ({OUT.stat().st_size / 1e6:.1f} MB), manifest {MANIFEST}')


if __name__ == '__main__':
    sys.exit(main())
