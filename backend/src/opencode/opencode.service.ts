import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface MessagePart {
  type: string;
  text?: string;
}

interface Session {
  id: string;
}

interface MessageResponse {
  parts?: MessagePart[];
}

@Injectable()
export class OpencodeService {
  private readonly baseUrl: string;
  private readonly username: string;
  private readonly password: string;
  private readonly providerID: string;
  private readonly modelID: string;

  constructor(private readonly config: ConfigService) {
    this.baseUrl =
      this.config.get<string>('OPENCODE_SERVER_URL') ?? 'http://127.0.0.1:5023';
    this.username =
      this.config.get<string>('OPENCODE_SERVER_USERNAME') ?? 'opencode';
    this.password = this.config.get<string>('OPENCODE_SERVER_PASSWORD') ?? '';
    this.providerID = this.config.get<string>('OPENCODE_PROVIDER') ?? 'opencode';
    this.modelID =
      this.config.get<string>('OPENCODE_MODEL') ?? 'deepseek-v4-flash-free';
  }

  async run(prompt: string): Promise<string> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization:
        'Basic ' + Buffer.from(`${this.username}:${this.password}`).toString('base64'),
    };

    const session = await this.createSession(headers);
    try {
      const response = await this.sendMessage(session.id, prompt, headers);
      return (response.parts ?? [])
        .filter((part) => part.type === 'text' && part.text)
        .map((part) => part.text as string)
        .join('\n')
        .trim();
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
    prompt: string,
    headers: Record<string, string>,
  ): Promise<MessageResponse> {
    const res = await fetch(`${this.baseUrl}/session/${sessionId}/message`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: { providerID: this.providerID, modelID: this.modelID },
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