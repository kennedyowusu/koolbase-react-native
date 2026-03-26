import {
  KoolbaseConfig,
  KoolbaseSession,
  KoolbaseUser,
  LoginParams,
  RegisterParams,
} from './types';

export class KoolbaseAuth {
  private config: KoolbaseConfig;
  private session: KoolbaseSession | null = null;

  constructor(config: KoolbaseConfig) {
    this.config = config;
  }

  private get headers() {
    return { 'Content-Type': 'application/json' };
  }

  private get authHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.session
        ? { Authorization: `Bearer ${this.session.accessToken}` }
        : {}),
    };
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    auth = false
  ): Promise<T> {
    const res = await fetch(`${this.config.baseUrl}${path}`, {
      method,
      headers: auth ? this.authHeaders : this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error ?? `Request failed: ${res.status}`);
    }
    return data as T;
  }

  async register(params: RegisterParams): Promise<KoolbaseUser> {
    const data = await this.request<{ user: KoolbaseUser }>(
      'POST',
      '/v1/sdk/auth/register',
      params
    );
    return data.user;
  }

  async login(params: LoginParams): Promise<KoolbaseSession> {
    const data = await this.request<KoolbaseSession>(
      'POST',
      '/v1/sdk/auth/login',
      params
    );
    this.session = data;
    return data;
  }

  async logout(): Promise<void> {
    if (!this.session) return;
    try {
      await this.request('POST', '/v1/sdk/auth/logout', {}, true);
    } finally {
      this.session = null;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    await this.request('POST', '/v1/sdk/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await this.request('POST', '/v1/sdk/auth/reset-password', {
      token,
      password,
    });
  }

  get currentUser(): KoolbaseUser | null {
    return this.session?.user ?? null;
  }

  get accessToken(): string | null {
    return this.session?.accessToken ?? null;
  }

  setSession(session: KoolbaseSession | null): void {
    this.session = session;
  }
}
