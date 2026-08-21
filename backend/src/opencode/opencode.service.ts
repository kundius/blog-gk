import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface MessagePart {
  type: string;
  text?: string;
}

interface Session {
  id: string;
}

interface ModelRef {
  providerID: string;
  modelID: string;
}

interface MessageError {
  name?: string;
  data?: { message?: string };
}

interface MessageResponse {
  info?: {
    error?: MessageError;
    tokens?: {
      input?: number;
      output?: number;
      reasoning?: number;
    };
  };
  parts?: MessagePart[];
}

@Injectable()
export class OpencodeService {
  private readonly logger = new Logger(OpencodeService.name);
  private readonly baseUrl: string;
  private readonly username: string;
  private readonly password: string;
  private readonly models: ModelRef[];

  constructor(private readonly config: ConfigService) {
    this.baseUrl =
      this.config.get<string>('OPENCODE_SERVER_URL') ?? 'http://127.0.0.1:5023';
    this.username =
      this.config.get<string>('OPENCODE_SERVER_USERNAME') ?? 'opencode';
    this.password = this.config.get<string>('OPENCODE_SERVER_PASSWORD') ?? '';
    this.models = this.parseModels(
      this.config.get<string>('OPENCODE_MODELS'),
      this.config.get<string>('OPENCODE_MODEL'),
    );
  }

  async run(prompt: string): Promise<string> {
    const errors: string[] = [];
    for (const model of this.models) {
      this.logger.log(`opencode запрос: ${model.providerID}/${model.modelID}`);
      try {
        return await this.runWithModel(model, prompt);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        errors.push(`${model.providerID}/${model.modelID}: ${message}`);
        this.logger.warn(
          `opencode model ${model.providerID}/${model.modelID} failed: ${message}`,
        );
      }
    }
    throw new Error(`Все модели opencode недоступны: ${errors.join('; ')}`);
  }

  private parseModels(modelsEnv?: string, modelEnv?: string): ModelRef[] {
    const raw = (modelsEnv ?? modelEnv ?? 'opencode/big-pickle')
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const [providerID, modelID] = entry.split('/');
        return modelID
          ? { providerID, modelID }
          : { providerID: 'opencode', modelID: providerID };
      });
    return raw.length > 0
      ? raw
      : [{ providerID: 'opencode', modelID: 'big-pickle' }];
  }

  private async runWithModel(model: ModelRef, prompt: string): Promise<string> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization:
        'Basic ' +
        Buffer.from(`${this.username}:${this.password}`).toString('base64'),
    };

    const session = await this.createSession(headers);
    try {
      const response = await this.sendMessage(session.id, model, prompt, headers);
      const error = response.info?.error;
      if (error) {
        throw new Error(error.data?.message || error.name || 'unknown error');
      }
      const text = (response.parts ?? [])
        .filter((part) => part.type === 'text' && part.text)
        .map((part) => part.text as string)
        .join('\n')
        .trim();
      if (!text) {
        const types =
          (response.parts ?? [])
            .map((part) => part.type)
            .join(',') || 'нет частей';
        const tokens = response.info?.tokens;
        this.logger.warn(
          `opencode пустой ответ (${model.providerID}/${model.modelID}): parts=[${types}]${
            tokens ? `, tokens=${JSON.stringify(tokens)}` : ''
          }`,
        );
        throw new Error('пустой ответ');
      }
      return text;
    } finally {
      await this.deleteSession(session.id, headers);
    }
  }

  private async createSession(headers: Record<string, string>): Promise<Session> {
    const res = await fetch(`${this.baseUrl}/session`, {
      method: 'POST',
      headers,
    });
    if (!res.ok) {
      throw new Error(`Failed to create opencode session: ${res.status}`);
    }
    return (await res.json()) as Session;
  }

  private async sendMessage(
    sessionId: string,
    model: ModelRef,
    prompt: string,
    headers: Record<string, string>,
  ): Promise<MessageResponse> {
    const res = await fetch(`${this.baseUrl}/session/${sessionId}/message`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: { providerID: model.providerID, modelID: model.modelID },
        parts: [{ type: 'text', text: prompt }],
      }),
    });
    if (!res.ok) {
      throw new Error(`Failed to send opencode message: ${res.status}`);
    }
    return (await res.json()) as MessageResponse;
  }

  private async deleteSession(
    sessionId: string,
    headers: Record<string, string>,
  ): Promise<void> {
    await fetch(`${this.baseUrl}/session/${sessionId}`, {
      method: 'DELETE',
      headers,
    });
  }
}
