import { Injectable } from '@nestjs/common';
import { OpencodeService } from './opencode.service';
import { WordstatService } from './wordstat.service';
import { PrismaService } from '../prisma/prisma.service';

export interface ArticleTextInput {
  title: string;
  excerpt?: string | null;
  content: string;
}

export interface SeoKey {
  key: string;
  freq?: number;
}

export interface SeoOptimizeResult {
  keys: SeoKey[];
  seo_keywords: string[];
  seo_title: string;
  seo_description: string;
}

export interface AltsResult {
  content: string;
}

export interface NutritionResult {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface NutritionInput {
  ingredients: { name: string; amount?: string }[];
}

export interface RelatedArticleSuggestion {
  id: string;
  name: string;
  alias: string | null;
  category: { id: string; name: string; alias: string } | null;
  thumbnail: { id: string; blurhash: string | null } | null;
}

export interface RelatedPickInput {
  title: string;
  categoryId: string;
  excludeId?: string;
}

@Injectable()
export class SeoService {
  constructor(
    private readonly opencode: OpencodeService,
    private readonly wordstat: WordstatService,
    private readonly prisma: PrismaService,
  ) {}

  async optimizeSeo(input: ArticleTextInput): Promise<SeoOptimizeResult> {
    const basePhrase = await this.extractBasePhrase(input);
    const phrases = await this.wordstat.getTopPhrases(basePhrase, 30);

    const prompt = [
      'Выполни навык `seo-fields-generate` и строго следуй его инструкциям.',
      'Входные данные:',
      `Название статьи (H1): ${input.title}`,
      `Анонс статьи: ${input.excerpt ?? ''}`,
      `Единый текст рецепта (HTML): ${input.content}`,
      `Сырой список ключевых слов из API (формат «фраза — частотность»):\n${phrases
        .map((p) => `${p.phrase} — ${p.count}`)
        .join('\n')}`,
    ].join('\n');

    const raw = await this.opencode.run(prompt);
    const parsed = this.parseJson<{
      keys?: Array<string | { key?: unknown; freq?: unknown }>;
      seo_keywords?: unknown;
      seo_title?: unknown;
      seo_description?: unknown;
    }>(raw);

    const freqMap = new Map(
      phrases.map((p) => [p.phrase.trim().toLowerCase(), p.count]),
    );
    const seen = new Set<string>();
    const keys = (parsed.keys ?? [])
      .map((item): { key: string; freq?: number } | null => {
        const key =
          typeof item === 'string'
            ? item.trim()
            : typeof item?.key === 'string'
              ? item.key.trim()
              : '';
        if (!key) return null;
        const directFreq =
          typeof item === 'object' && typeof item.freq === 'number'
            ? item.freq
            : undefined;
        return {
          key,
          freq: directFreq ?? freqMap.get(key.toLowerCase()),
        };
      })
      .filter((k): k is { key: string; freq?: number } => {
        if (!k || seen.has(k.key)) return false;
        seen.add(k.key);
        return true;
      });

    return {
      keys,
      seo_keywords: Array.isArray(parsed.seo_keywords)
        ? parsed.seo_keywords.filter((k): k is string => typeof k === 'string')
        : [],
      seo_title:
        typeof parsed.seo_title === 'string' ? parsed.seo_title : '',
      seo_description:
        typeof parsed.seo_description === 'string'
          ? parsed.seo_description
          : '',
    };
  }

  async fillAlts(input: ArticleTextInput): Promise<AltsResult> {
    if (!/<img\b/i.test(input.content)) {
      return { content: input.content };
    }
    const prompt = [
      'Выполни навык `image-alts-fill` и строго следуй его инструкциям.',
      'Входные данные:',
      `Название статьи (H1): ${input.title}`,
      `Анонс статьи: ${input.excerpt ?? ''}`,
      `Единый текст рецепта (HTML): ${input.content}`,
    ].join('\n');

    const raw = await this.opencode.run(prompt);
    const parsed = this.parseJson<{ full_text: string }>(raw);
    return { content: this.restoreImageSrc(input.content, parsed.full_text) };
  }

  async calculateNutrition(input: NutritionInput): Promise<NutritionResult> {
    const list = input.ingredients
      .map((i) => `- ${i.name}${i.amount ? ` — ${i.amount}` : ''}`)
      .join('\n');
    const prompt = [
      'Выполни навык `nutrition-calculate` и строго следуй его инструкциям.',
      'Входные данные:',
      `Список ингредиентов с количествами:\n${list}`,
    ].join('\n');

    const attempts = await Promise.allSettled(
      Array.from({ length: 3 }, () =>
        this.opencode
          .run(prompt)
          .then((raw) => this.parseJson<NutritionResult>(raw)),
      ),
    );

    const valid = attempts
      .map((r) => (r.status === 'fulfilled' ? r.value : null))
      .filter(
        (r): r is NutritionResult =>
          r != null &&
          [r.calories, r.protein, r.fat, r.carbs].every(
            (v) => typeof v === 'number' && Number.isFinite(v),
          ),
      );

    if (!valid.length) {
      const failed = attempts.find(
        (a): a is PromiseRejectedResult => a.status === 'rejected',
      );
      throw new Error(
        failed ? String(failed.reason) : 'Не удалось рассчитать КБЖУ',
      );
    }

    const pick = (get: (r: NutritionResult) => number) =>
      Number(this.median(valid.map(get)).toFixed(1));

    return {
      calories: pick((r) => r.calories),
      protein: pick((r) => r.protein),
      fat: pick((r) => r.fat),
      carbs: pick((r) => r.carbs),
    };
  }

  private median(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  async pickRelated(
    input: RelatedPickInput,
  ): Promise<{ articles: RelatedArticleSuggestion[] }> {
    const candidates = await this.prisma.article.findMany({
      where: {
        categoryId: input.categoryId,
        status: 'published',
        ...(input.excludeId ? { id: { not: input.excludeId } } : {}),
      },
      select: { id: true, name: true },
      orderBy: { dateUpdated: 'desc' },
      take: 50,
    });
    if (!candidates.length) return { articles: [] };

    const list = candidates.map((c, i) => `${i + 1}. ${c.name}`).join('\n');
    const prompt = [
      'Выполни навык `related-articles-pick` и строго следуй его инструкциям.',
      'Входные данные:',
      `Заголовок целевой статьи: ${input.title}`,
      `Пронумерованный список статей-кандидатов (номер. заголовок):\n${list}`,
    ].join('\n');

    const raw = await this.opencode.run(prompt);
    const parsed = this.parseJson<{ numbers?: unknown }>(raw);
    const numbers = Array.isArray(parsed.numbers)
      ? parsed.numbers.filter(
          (n): n is number =>
            typeof n === 'number' &&
            Number.isInteger(n) &&
            n >= 1 &&
            n <= candidates.length,
        )
      : [];

    const seen = new Set<string>();
    const pickedIds = numbers
      .map((n) => candidates[n - 1].id)
      .filter((id) => {
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      })
      .slice(0, 4);
    if (!pickedIds.length) return { articles: [] };

    const rows = await this.prisma.article.findMany({
      where: { id: { in: pickedIds } },
      include: { category: true, thumbnail: true },
    });
    const byId = new Map(rows.map((row) => [row.id, row]));
    const articles = pickedIds
      .map((id) => byId.get(id))
      .filter(
        (row): row is (typeof rows)[number] => row !== undefined,
      ) as unknown as RelatedArticleSuggestion[];

    return { articles };
  }

  private async extractBasePhrase(input: ArticleTextInput): Promise<string> {
    const opening = this.firstSentences(input.content, 3);
    const prompt = [
      'Выполни навык `seo-keyword-extract` и строго следуй его инструкциям.',
      'Входные данные:',
      `Название статьи: ${input.title}`,
      `Начало текста: ${opening}`,
    ].join('\n');
    const raw = await this.opencode.run(prompt);
    const phrase = this.parseBasePhrase(raw);
    if (!phrase) {
      throw new Error(`Не удалось извлечь базовую фразу из ответа: ${raw}`);
    }
    return phrase;
  }

  private parseBasePhrase(raw: string): string {
    const lines = raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    let phrase = '';
    const markerIndex = lines.findIndex((line) => line.startsWith('БАЗОВАЯ ФРАЗА:'));
    if (markerIndex !== -1) {
      phrase = lines[markerIndex].replace(/^БАЗОВАЯ ФРАЗА:\s*/i, '').trim();
    } else if (lines.length > 0) {
      phrase = lines[lines.length - 1];
    }
    return this.cleanPhrase(phrase);
  }

  private cleanPhrase(phrase: string): string {
    let text = phrase.replace(/^["'««]|["'»»]$/g, '').trim();
    text = text.replace(/^(["'`])|(["'`])$/g, '').trim();
    text = text.replace(/\s+/g, ' ').trim();
    return text.toLowerCase().slice(0, 80);
  }

  private firstSentences(html: string, count: number): string {
    const text = html
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const parts = text.split(/(?<=[.!?…])\s+/);
    return parts.slice(0, count).join(' ');
  }

  private restoreImageSrc(originalHtml: string, resultHtml: string): string {
    const imgRe = /<img\b[^>]*?\bsrc=(["'])([\s\S]*?)\1[^>]*>/gi;
    const originals: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = imgRe.exec(originalHtml)) !== null) {
      originals.push(m[2]);
    }
    if (originals.length === 0) return resultHtml;
    let index = 0;
    return resultHtml.replace(imgRe, (tag: string) => {
      const orig = originals[index++];
      if (orig === undefined) return tag;
      const srcMatch = tag.match(/\bsrc=(["'])([\s\S]*?)\1/i);
      if (!srcMatch || srcMatch.index === undefined || srcMatch[2] === orig) {
        return tag;
      }
      return (
        tag.slice(0, srcMatch.index) +
        `src=${srcMatch[1]}${orig}${srcMatch[1]}` +
        tag.slice(srcMatch.index + srcMatch[0].length)
      );
    });
  }

  private parseJson<T>(raw: string): T {
    let text = raw.trim();
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) {
      text = fenced[1].trim();
    }
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      text = text.slice(start, end + 1);
    }
    try {
      return JSON.parse(text) as T;
    } catch {
      const snippet = raw.trim().slice(0, 200);
      throw new Error(`Модель не вернула валидный JSON. Начало ответа: ${snippet}`);
    }
  }
}
