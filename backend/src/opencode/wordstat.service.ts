import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface WordstatItem {
  phrase: string;
  count: string;
}

interface WordstatResponse {
  totalCount?: string;
  results?: WordstatItem[];
  associations?: WordstatItem[];
}

@Injectable()
export class WordstatService {
  private readonly logger = new Logger(WordstatService.name);
  private readonly apiKey: string;
  private readonly folderId: string;
  private readonly baseUrl: string;

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>('AI_STUDIO_API_KEY') ?? '';
    this.folderId = this.config.get<string>('AI_STUDIO_FOLDER_ID') ?? '';
    this.baseUrl =
      this.config.get<string>('WORDSTAT_URL') ??
      'https://searchapi.api.cloud.yandex.net/v2/wordstat/topRequests';
  }

  async getTopPhrases(phrase: string, numPhrases = 30): Promise<string[]> {
    if (!this.apiKey) {
      throw new Error('AI_STUDIO_API_KEY is not configured');
    }
    if (!this.folderId) {
      throw new Error('AI_STUDIO_FOLDER_ID is not configured');
    }

    const payload = {
      phrase,
      numPhrases: String(numPhrases),
      regions: ['225'],
      devices: ['DEVICE_ALL'],
      folderId: this.folderId,
    };
    this.logger.log(
      `Wordstat request: ${JSON.stringify({ ...payload, phrase: `${phrase} (${phrase.length} chars)` })}`,
    );

    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      this.logger.warn(`Wordstat response ${res.status}: ${body}`);
      throw new Error(`Wordstat request failed: ${res.status} ${body}`);
    }

    const data = (await res.json()) as WordstatResponse;
    return (data.results ?? []).map((item) => item.phrase);
  }
}