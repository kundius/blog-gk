#!/usr/bin/env python3
"""Подбор «похожих статей» (articles_related) по смысловому сходству заголовков.

Для каждой опубликованной статьи выбираются 4 похожие по близости смысла
заголовка (TF-IDF над символьными 4-граммами названия, устойчивыми к русской
морфологии). Приоритет — статьи из той же категории (как у существующего
фолбэка сервиса); если в категории меньше 4 опубликованных статей — добираем
ближайшими из других категорий. Себя и дубли исключаем.

Команды:
  python3 tools/related/related.py candidates <articles.tsv>
      считает кандидатов и пишет candidates.tsv (alias<TAB>похожие через ,)
  python3 tools/related/related.py sql <articles.tsv>
      накладывает overrides.tsv (alias<TAB>через ,) на кандидатов,
      пишет final.tsv и related.sql (INSERT в articles_related)
  python3 tools/related/related.py apply
      бэкап БД + применение related.sql (по умолчанию только dry-run)

Файл overrides.tsv (опциональный) переопределяет выбор для конкретной статьи:
  alias	похожий1,похожий2,похожий3,похожий4
Меньше 4 — остальные добираются из кандидатов. См. overrides.tsv.

Запускать на хосте (python3, стандартная библиотека) из корня репозитория.
"""
import argparse, math, os, re, subprocess, sys
from collections import defaultdict, Counter

BASE = os.path.dirname(os.path.abspath(__file__))
DB = ['docker', 'compose', 'exec', '-T', 'postgres', 'psql',
      '-U', 'blog_gk_user', '-d', 'blog_gk_db']
SIMILAR = 4
SAME_CAT_BOOST = 1.35


def check_repo_root():
    root = os.path.dirname(os.path.dirname(BASE))
    if os.path.basename(root) != 'blog-gk':
        sys.exit('run from the repo root')


def norm(name):
    text = name.lower().replace('ё', 'е')
    text = re.sub(r'[^а-яa-z0-9 ]+', ' ', text)
    return ' '.join(text.split())


def chargrams(text, n=4):
    return [text[i:i + n] for i in range(len(text) - n + 1)]


def load_articles(path):
    rows = []
    with open(path, encoding='utf-8') as f:
        for line in f:
            parts = line.rstrip('\n').split('\t')
            if len(parts) != 5:
                continue
            cat, aid, alias, name, status = parts
            rows.append({'cat': cat, 'id': aid, 'alias': alias,
                         'name': name, 'status': status})
    return rows


def build_vectors(articles):
    n = len(articles)
    tf = []
    df = Counter()
    for a in articles:
        grams = chargrams(norm(a['name']))
        c = Counter(grams)
        tf.append(c)
        df.update(c.keys())
    idf = {g: math.log((n + 1) / (v + 1)) + 1.0 for g, v in df.items()}
    vecs = []
    for c in tf:
        v = {g: cnt * idf[g] for g, cnt in c.items()}
        norm_ = math.sqrt(sum(x * x for x in v.values())) or 1.0
        vecs.append({g: x / norm_ for g, x in v.items()})
    return vecs


def cosine(a, b):
    if not a or not b:
        return 0.0
    if len(a) > len(b):
        a, b = b, a
    s = 0.0
    for g, x in a.items():
        y = b.get(g)
        if y is not None:
            s += x * y
    return s


def compute_candidates(articles):
    vecs = build_vectors(articles)
    by_cat = defaultdict(list)
    for i, a in enumerate(articles):
        by_cat[a['cat']].append(i)

    out = []
    for i, a in enumerate(articles):
        same = [j for j in by_cat[a['cat']] if j != i]
        pool = list(same)
        if len(pool) < SIMILAR:
            rest = [j for j in range(len(articles)) if j != i and j not in by_cat[a['cat']]]
            rest.sort(key=lambda j: -cosine(vecs[i], vecs[j]))
            pool = pool + rest[:SIMILAR * 2]
        scored = []
        for j in pool:
            s = cosine(vecs[i], vecs[j])
            boost = SAME_CAT_BOOST if articles[j]['cat'] == a['cat'] else 1.0
            scored.append((s * boost, articles[j]))
        scored.sort(key=lambda x: -x[0])
        rel = [x[1]['alias'] for x in scored[:SIMILAR]]
        if len(rel) < SIMILAR:
            extra = [j for j in range(len(articles)) if j != i]
            extra.sort(key=lambda j: -cosine(vecs[i], vecs[j]))
            for j in extra:
                al = articles[j]['alias']
                if al not in rel:
                    rel.append(al)
                if len(rel) >= SIMILAR:
                    break
        out.append((a, rel))
    return out


def write_candidates(articles, out_path):
    pairs = compute_candidates(articles)
    with open(out_path, 'w', encoding='utf-8') as f:
        for a, rel in pairs:
            f.write('%s\t%s\n' % (a['alias'], ','.join(rel)))
    print('candidates -> %s (%d rows)' % (out_path, len(pairs)))
    return pairs


def load_overrides(path):
    ov = {}
    if not os.path.exists(path):
        return ov
    with open(path, encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            parts = line.split('\t')
            if len(parts) != 2:
                sys.exit('bad override line: %r' % line)
            ov[parts[0]] = [x for x in parts[1].split(',') if x]
    return ov


def merge(articles, candidates, overrides_path):
    cand = {a: rel for a, rel in candidates}
    ov = load_overrides(overrides_path)
    merged = {}
    for a in articles:
        rel = list(ov.get(a['alias'], cand.get(a['alias'], [])))
        for r in cand.get(a['alias'], []):
            if len(rel) >= SIMILAR:
                break
            if r not in rel:
                rel.append(r)
        merged[a['alias']] = rel[:SIMILAR]
    return merged


def gen_sql(articles, merged):
    by_alias = {a['alias']: a for a in articles}
    rows = []
    problems = []
    for alias, rel in merged.items():
        src = by_alias[alias]
        for sort, r in enumerate(rel, 1):
            dst = by_alias.get(r)
            if dst is None:
                problems.append('%s -> %s (no such alias)' % (alias, r))
                continue
            if r == alias:
                problems.append('%s -> self' % alias)
                continue
            rows.append((src['id'], dst['id'], sort))
    return rows, problems


def write_sql(rows, problems, sql_path):
    with open(sql_path, 'w', encoding='utf-8') as f:
        f.write('BEGIN;\n')
        f.write('DELETE FROM articles_related;\n')
        vals = ',\n'.join(
            "('%s'::uuid, '%s'::uuid, %d)" % (s, d, o) for s, d, o in rows)
        f.write('INSERT INTO articles_related ("article", "related_article", "sort") VALUES\n%s;\n' % vals)
        f.write('COMMIT;\n')
    print('sql -> %s (%d rows, %d problems)' % (sql_path, len(rows), len(problems)))
    for p in problems[:30]:
        print('  !', p)


def apply():
    sql_path = os.path.join(BASE, 'related.sql')
    if not os.path.exists(sql_path):
        sys.exit('no related.sql, run `sql` first')
    ts = __import__('datetime').datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_dir = os.path.join(BASE, 'backups')
    os.makedirs(backup_dir, exist_ok=True)
    backup = os.path.join(backup_dir, 'pre_%s.sql' % ts)
    r = subprocess.run(['docker', 'compose', 'exec', '-T', 'postgres', 'pg_dump',
                        '-U', 'blog_gk_user', '-d', 'blog_gk_db'], capture_output=True)
    with open(backup, 'wb') as f:
        f.write(r.stdout)
    print('backup -> %s' % backup)
    with open(sql_path, encoding='utf-8') as f:
        sql = f.read()
    r = subprocess.run(DB + ['-f', '-'], input=sql, capture_output=True, text=True)
    print(r.stdout, end='')
    if r.stderr.strip():
        print(r.stderr, file=sys.stderr)


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest='cmd', required=True)
    c = sub.add_parser('candidates')
    c.add_argument('articles')
    c.add_argument('-o', '--out', default=os.path.join(BASE, 'candidates.tsv'))
    s = sub.add_parser('sql')
    s.add_argument('articles')
    s.add_argument('-c', '--candidates', default=os.path.join(BASE, 'candidates.tsv'))
    s.add_argument('-o', '--overrides', default=os.path.join(BASE, 'overrides.tsv'))
    a = sub.add_parser('apply')
    args = ap.parse_args()

    check_repo_root()

    if args.cmd == 'candidates':
        articles = [x for x in load_articles(args.articles) if x['status'] == 'published']
        write_candidates(articles, args.out)
    elif args.cmd == 'sql':
        articles = [x for x in load_articles(args.articles) if x['status'] == 'published']
        with open(args.candidates, encoding='utf-8') as f:
            candidates = [(line.split('\t')[0], line.rstrip('\n').split('\t')[1].split(','))
                          for line in f if '\t' in line]
        merged = merge(articles, candidates, args.overrides)
        rows, problems = gen_sql(articles, merged)
        write_sql(rows, problems, os.path.join(BASE, 'related.sql'))
        with open(os.path.join(BASE, 'final.tsv'), 'w', encoding='utf-8') as f:
            for a in articles:
                f.write('%s\t%s\n' % (a['alias'], ','.join(merged[a['alias']])))
        print('final -> tools/related/final.tsv')
    elif args.cmd == 'apply':
        apply()


if __name__ == '__main__':
    main()
