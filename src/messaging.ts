import { KoolbaseConfig } from './types';

// ─── Models ──────────────────────────────────────────────────────────────────

export interface RegisterTokenOptions {
  token: string;
  platform: 'android' | 'ios';
  userId?: string;
}

export interface SendOptions {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

// ─── KoolbaseMessaging ────────────────────────────────────────────────────────

export class KoolbaseMessaging {
  private config: KoolbaseConfig;
  private deviceId = '';

  constructor(config: KoolbaseConfig) {
    this.config = config;
  }

  setDeviceId(deviceId: string): void {
    this.deviceId = deviceId;
  }

  // ─── Register token ───────────────────────────────────────────────────────

  async registerToken(options: RegisterTokenOptions): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/v1/messaging/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.publicKey,
        },
        body: JSON.stringify({
          device_id: this.deviceId,
          token: options.token,
          platform: options.platform,
          ...(options.userId && { user_id: options.userId }),
        }),
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  // ─── Send notification ────────────────────────────────────────────────────

  async send(options: SendOptions): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/v1/messaging/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.publicKey,
        },
        body: JSON.stringify({
          token: options.to,
          title: options.title,
          body: options.body,
          data: options.data ?? {},
        }),
      });

      return response.ok;
    } catch {
      return false;
    }
  }
}
