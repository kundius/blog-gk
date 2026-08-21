import { Injectable } from '@nestjs/common';
import { OpencodeService } from './opencode.service';
import { WordstatService } from './wordstat.service';

export interface ArticleTextInput {
  title: string;
  excerpt?: string | null;
  content: string;
}

export interface SeoOptimizeResult {
  keys: string[];
  seo_keywords: string[];
  seo_title: string;
  seo_description: string;
}

export interface AltsResult {
  content: string;
}

@Injectable()
export class SeoService {
  constructor(
    private readonly opencode: OpencodeService,
    private readonly wordstat: WordstatService,
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
      `Сырой список ключевых слов из API:\n${phrases.join('\n')}`,
    ].join('\n');

    const raw = await this.opencode.run(prompt);
    return this.parseJson<SeoOptimizeResult>(raw);
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
