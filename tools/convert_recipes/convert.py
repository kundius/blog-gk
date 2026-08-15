#!/usr/bin/env python3
"""Конвертер контента рецептов в tiptap-расширения.

Преобразует сырой HTML статей в структуру с кастомными расширениями:
  <div data-ingredients="true">, <section class="recipe-steps">,
  <div class="gallery">. Дополнительно чинит битые src картинок
  (удвоенное расширение ``..jpg..jpg`` -> ``..jpg``) по ``files.filename_disk``.

Данные берутся напрямую из БД (через ``docker compose exec postgres psql``),
поэтому скрипт самодостаточен — никаких внешних дампов не требуется.

Запуск (из корня репозитория):
  python3 tools/convert_recipes/convert.py                        # все статьи (dry-run)
  python3 tools/convert_recipes/convert.py <id> [<id> ...]        # конкретные статьи
  python3 tools/convert_recipes/convert.py --ids-file list.txt    # id из файла

Опции:
  --apply    записать результат в БД (по умолчанию — только отчёт, dry-run)
  --force    переконвертировать уже преобразованные (исходник — old_content)
  --out FILE сохранить результат в JSON (по умолчанию transformed.json рядом)
"""
import json, re, sys, html as htmllib, subprocess, argparse, os, datetime

BASE = os.path.dirname(os.path.abspath(__file__))
DB = ['docker', 'compose', 'exec', '-T', 'postgres', 'psql', '-U', 'blog_gk_user', '-d', 'blog_gk_db']

VOID = {'img','br','hr','input','meta','link','area','base','col','embed','source','track','wbr'}


def split_blocks(content):
    blocks = []
    depth = 0
    cur = ''
    started = False
    pos = 0
    n = len(content)
    tag_re = re.compile(r'<[^>]*>')
    while pos < n:
        m = tag_re.search(content, pos)
        if not m:
            if started:
                cur += content[pos:]
            break
        if started:
            cur += content[pos:m.start()]
        tag = m.group(0)
        nm = re.match(r'</?\s*([a-zA-Z][a-zA-Z0-9]*)', tag)
        name = nm.group(1).lower() if nm else None
        if name in VOID:
            if started:
                cur += tag
            pos = m.end()
            continue
        if tag.startswith('</'):
            depth -= 1
            cur += tag
            if depth == 0 and started:
                blocks.append(cur)
                cur = ''
                started = False
        else:
            if depth == 0:
                if started:
                    blocks.append(cur)
                cur = tag
                started = True
            else:
                cur += tag
            depth += 1
        pos = m.end()
    if started:
        blocks.append(cur)
    return blocks


TAGRE = re.compile(r'<[^>]+>')
IMGRE = re.compile(r'<img\b[^>]*/?>')


def strip_tags(s):
    return TAGRE.sub('', s).replace('&nbsp;', ' ').replace('&amp;', '&')


def block_info(b):
    m = re.match(r'<\s*([a-zA-Z][a-zA-Z0-9]*)([^>]*)>', b)
    tag = m.group(1).lower()
    inner = b[m.end():]
    inner = re.sub(r'</\s*' + re.escape(tag) + r'\s*>$', '', inner)
    imgs = IMGRE.findall(inner)
    textonly = strip_tags(IMGRE.sub('', inner)).strip()
    is_heading = tag in ('h1','h2','h3','h4','h5','h6')
    is_img_block = (not textonly) and len(imgs) > 0
    is_empty = (not textonly) and not imgs
    return dict(tag=tag, inner=inner, imgs=imgs, textonly=textonly,
                is_heading=is_heading, is_img_block=is_img_block, is_empty=is_empty)


def img_attrs(imgtag):
    src = re.search(r'src="([^"]*)"', imgtag)
    alt = re.search(r'alt="([^"]*)"', imgtag)
    return (src.group(1) if src else '', alt.group(1) if alt else '')


def img_tag(src, alt):
    return f'<img class="gallery-image__img" src="{src}" alt="{alt}" />'


def plain_img_tag(imgtag, alt):
    t = re.sub(r'\s+alt="[^"]*"', '', imgtag)
    t = re.sub(r'\s*/\s*>$', '>', t)
    t = re.sub(r'>$', f' alt="{alt}">', t)
    return f'<p>{t}</p>'


def seo_alt(dish, step_text=None):
    if step_text:
        frag = strip_tags(step_text).strip()
        frag = re.sub(r'^\s*\d+[\.\)]\s*', '', frag)
        frag = re.sub(r'[\r\n]+', ' ', frag)
        frag = htmllib.unescape(frag)
        if len(frag) > 110:
            frag = frag[:110].rsplit(' ', 1)[0]
        return f"{dish}: {frag}"
    return dish


STEP_RE = re.compile(r'^\s*\d+[\.\)]')


def transform(content, dish):
    blocks = split_blocks(content)
    infos = [block_info(b) for b in blocks]
    infos = [i for i in infos if not i['is_empty']]
    if not infos:
        return None, 'no-content'

    first_step = None
    for idx, i in enumerate(infos):
        if not i['is_img_block'] and not i['is_heading'] and STEP_RE.match(i['textonly']):
            first_step = idx
            break

    if first_step is None:
        new_parts = []
        for i in infos:
            if i['is_img_block']:
                for im in i['imgs']:
                    new_parts.append(plain_img_tag(im, seo_alt(dish)))
            elif i['is_heading']:
                new_parts.append(f'<{i["tag"]}>{i["inner"]}</{i["tag"]}>')
            else:
                inline = IMGRE.findall(i['inner'])
                text_inner = IMGRE.sub('', i['inner'])
                if text_inner.strip():
                    new_parts.append(f'<p>{text_inner}</p>')
                for im in inline:
                    new_parts.append(plain_img_tag(im, seo_alt(dish)))
        out = ''.join(new_parts)
        m = re.search(r'(</p>)', out)
        if m:
            out = out[:m.end()] + '<div data-ingredients="true"></div>' + out[m.end():]
        else:
            out = '<div data-ingredients="true"></div>' + out
        return out, 'no-steps'

    intro = infos[:first_step]
    rest = infos[first_step:]

    intro_text = []
    hero = []
    for i in intro:
        if i['is_img_block']:
            hero.extend(i['imgs'])
        else:
            intro_text.append(i)

    steps = []
    trailing = []
    step_indices = [idx for idx, i in enumerate(rest) if STEP_RE.match(i['textonly'])]
    last_step_idx = step_indices[-1] if step_indices else None
    cur = None
    in_last = False
    for idx, i in enumerate(rest):
        if i['is_heading']:
            trailing.append(i)
            cur = None
            in_last = False
        elif STEP_RE.match(i['textonly']):
            inline = IMGRE.findall(i['inner'])
            inner_noimg = IMGRE.sub('', i['inner'])
            inner_clean = re.sub(r'^\s*\d+[\.\)]\s*', '', inner_noimg, count=1)
            cur = {'ctx': inner_clean, 'segments': [{'type': 'text', 'inner': inner_clean, 'imgs': list(inline)}]}
            steps.append(cur)
            in_last = (idx == last_step_idx)
        elif cur is not None and not in_last:
            if i['is_img_block']:
                cur['segments'].append({'type': 'img', 'imgs': i['imgs']})
            else:
                inline = IMGRE.findall(i['inner'])
                inner_noimg = IMGRE.sub('', i['inner'])
                cur['segments'].append({'type': 'text', 'inner': inner_noimg, 'imgs': list(inline)})
        elif cur is not None and in_last:
            if i['is_img_block']:
                cur['segments'].append({'type': 'img', 'imgs': i['imgs']})
            else:
                cur = None
                trailing.append(i)
        else:
            trailing.append(i)

    parts = []
    for i in intro_text:
        if i['is_heading']:
            parts.append(f'<{i["tag"]}>{i["inner"]}</{i["tag"]}>')
        else:
            inline = IMGRE.findall(i['inner'])
            text_inner = IMGRE.sub('', i['inner'])
            if text_inner.strip():
                parts.append(f'<p>{text_inner}</p>')
            hero.extend(inline)
    for im in hero:
        parts.append(plain_img_tag(im, seo_alt(dish)))
    parts.append('<div data-ingredients="true"></div>')

    if steps:
        sp = ''.join(render_step(st, dish) for st in steps)
        parts.append(f'<section class="recipe-steps"><h2 class="recipe-steps__title">Пошаговое приготовление</h2><div class="recipe-steps__content">{sp}</div></section>')

    for i in trailing:
        if i['is_img_block']:
            for im in i['imgs']:
                parts.append(plain_img_tag(im, seo_alt(dish)))
        elif i['is_heading']:
            parts.append(f'<{i["tag"]}>{i["inner"]}</{i["tag"]}>')
        else:
            text_inner = IMGRE.sub('', i['inner'])
            if text_inner.strip():
                parts.append(f'<p>{text_inner}</p>')
            for im in i['imgs']:
                parts.append(plain_img_tag(im, seo_alt(dish)))

    return ''.join(parts), 'steps'


def render_step(st, dish):
    items = []
    for seg in st['segments']:
        if seg['type'] == 'text':
            if seg['inner'].strip():
                items.append(('p', seg['inner']))
            if seg['imgs']:
                items.append(('img', seg['imgs']))
        else:
            items.append(('img', seg['imgs']))

    body = ''
    gallery_open = False
    for kind, val in items:
        if kind == 'p':
            if gallery_open:
                body += '</div>'
                gallery_open = False
            body += f'<p>{val}</p>'
        else:
            imgs = ''.join(img_tag(img_attrs(im)[0], seo_alt(dish, st['ctx'])) for im in val)
            if not gallery_open:
                body += '<div class="gallery">'
                gallery_open = True
            body += imgs
    if gallery_open:
        body += '</div>'

    return f'<div class="recipe-step"><span class="recipe-step__num" aria-hidden="true"></span><div class="recipe-step__body">{body}</div></div>'


# --- DB helpers -------------------------------------------------------------

def psql(sql):
    r = subprocess.run(DB + ['-c', sql], capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f'psql failed: {r.stderr.strip()}')
    return r.stdout


def check_repo_root():
    if not os.path.exists('docker-compose.yml'):
        print('error: run from repository root (docker-compose.yml required)', file=sys.stderr)
        sys.exit(2)


def fetch_articles():
    out = psql('SELECT to_json(t) FROM articles t;')
    data = []
    for line in out.split('\n'):
        line = line.strip()
        if not line:
            continue
        try:
            data.append(json.loads(line))
        except ValueError:
            pass
    return data


def fetch_disks():
    out = psql('SELECT filename_disk FROM files;')
    disks = set(out.split())
    dl = {d.lower(): d for d in disks}
    return disks, dl


def repair_src(src, disks, dl):
    if src.startswith('/files/') and re.search(r'\.\.\w+\.\.\w+', src):
        key = src[len('/files/'):]
        m = re.match(r'^(.*?\.\.\w+)\.\.\w+$', key)
        if m:
            tgt = m.group(1)
            if tgt in disks:
                return '/files/' + tgt
            if tgt.lower() in dl:
                return '/files/' + dl[tgt.lower()]
        if key == '74d850bb-0fe2-4141-8040-5f8b409ed11b..jpg..jpg2.jpg':
            return '/files/74d850bb-0fe2-4141-8040-5f8b409ed11b..jpg'
    return src


def apply_src_repair(content, disks, dl):
    if not content:
        return content
    for s in set(re.findall(r'src="([^"]*)"', content)):
        r = repair_src(s, disks, dl)
        if r != s:
            content = content.replace(s, r)
    return content


def report_bad_srcs(rows):
    bad = {}
    for _, newc in rows:
        for s in re.findall(r'src="([^"]*)"', newc):
            if re.search(r'\.\.\w+\.\.\w+', s):
                bad['doubled_extension'] = bad.get('doubled_extension', 0) + 1
            elif not s.startswith('/files/'):
                bad['not_files_path'] = bad.get('not_files_path', 0) + 1
    for k, v in bad.items():
        print(f'WARN {k}: {v} (source data corruption, not repaired)')


def apply_to_db(rows):
    ts = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_dir = os.path.join(BASE, 'backups')
    os.makedirs(backup_dir, exist_ok=True)
    backup = os.path.join(backup_dir, f'pre_{ts}.sql')
    r = subprocess.run(['docker', 'compose', 'exec', '-T', 'postgres', 'pg_dump',
                        '-U', 'blog_gk_user', '-d', 'blog_gk_db'], capture_output=True)
    with open(backup, 'wb') as f:
        f.write(r.stdout)
    print(f'backup -> {backup}')

    ids = [c for c, _ in rows]
    esc = lambda x: (x or '').replace("'", "''")
    vals = ",\n".join("( '%s'::uuid, '%s' )" % (c, esc(n)) for c, n in rows)
    sql = '\n'.join([
        'BEGIN;',
        'UPDATE articles SET old_content = COALESCE(NULLIF(old_content, \'\'), content) '
        'WHERE id IN (%s);' % ','.join("'%s'" % c for c in ids),
        'UPDATE articles AS t SET content = v.c FROM (VALUES %s) AS v(id, c) WHERE t.id = v.id;' % vals,
        'COMMIT;',
    ])
    r = subprocess.run(DB + ['-f', '-'], input=sql, capture_output=True, text=True)
    print(r.stdout, end='')
    if r.stderr.strip():
        print(r.stderr, file=sys.stderr)


def main():
    ap = argparse.ArgumentParser(description='Convert recipe content to tiptap extensions')
    ap.add_argument('ids', nargs='*', help='article ids to convert (default: all not-yet-converted)')
    ap.add_argument('--ids-file', help='file with article ids, one per line')
    ap.add_argument('--apply', action='store_true', help='write results to DB (default: dry-run)')
    ap.add_argument('--force', action='store_true', help='re-convert already converted (source: old_content)')
    ap.add_argument('--out', default=os.path.join(BASE, 'transformed.json'), help='output JSON path')
    args = ap.parse_args()

    check_repo_root()

    ids = set(args.ids)
    if args.ids_file:
        with open(args.ids_file) as f:
            ids |= {l.strip() for l in f if l.strip()}

    articles = fetch_articles()
    disks, dl = fetch_disks()

    rows = []
    stats = {'steps': 0, 'no-steps': 0, 'skip': 0, 'error': 0}
    for a in articles:
        cid = a['id']
        if ids and cid not in ids:
            continue
        content = a.get('content') or ''
        already = 'data-ingredients' in content
        if already and not args.force:
            stats['skip'] += 1
            continue
        source = (a.get('old_content') or content) if already else content
        if not source.strip():
            stats['skip'] += 1
            continue
        try:
            newc, kind = transform(source, a.get('name') or 'Блюдо')
        except Exception as e:
            stats['error'] += 1
            print('ERR', cid, repr(e), file=sys.stderr)
            continue
        newc = apply_src_repair(newc, disks, dl)
        stats[kind] += 1
        rows.append((cid, newc))

    print('STATS', stats)
    report_bad_srcs(rows)

    if args.out:
        with open(args.out, 'w') as f:
            json.dump(rows, f, ensure_ascii=False)
        print(f'output -> {args.out}')

    if args.apply and rows:
        apply_to_db(rows)
    elif args.apply:
        print('nothing to apply (all skipped/errors)')


if __name__ == '__main__':
    main()