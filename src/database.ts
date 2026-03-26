import {
  KoolbaseConfig,
  KoolbaseRecord,
  QueryOptions,
  QueryResult,
} from './types';

export class KoolbaseDatabase {
  private config: KoolbaseConfig;
  private getUserId: () => string | null;

  constructor(config: KoolbaseConfig, getUserId: () => string | null) {
    this.config = config;
    this.getUserId = getUserId;
  }

  private get headers(): Record<string, string> {
    const userId = this.getUserId();
    return {
      'Content-Type': 'application/json',
      'x-api-key': this.config.publicKey,
      ...(userId ? { 'x-user-id': userId } : {}),
    };
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const res = await fetch(`${this.config.baseUrl}${path}`, {
      method,
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error ?? `Request failed: ${res.status}`);
    }
    return data as T;
  }

  async insert(
    collection: string,
    data: Record<string, unknown>
  ): Promise<KoolbaseRecord> {
    return this.request<KoolbaseRecord>('POST', '/v1/sdk/db/insert', {
      collection,
      data,
    });
  }

  async query(
    collection: string,
    options: QueryOptions = {}
  ): Promise<QueryResult> {
    return this.request<QueryResult>('POST', '/v1/sdk/db/query', {
      collection,
      filters: options.filters ?? {},
      limit: options.limit ?? 20,
      offset: options.offset ?? 0,
      order_by: options.orderBy,
      order_desc: options.orderDesc ?? false,
      populate: options.populate ?? [],
    });
  }

  async get(recordId: string): Promise<KoolbaseRecord> {
    return this.request<KoolbaseRecord>(
      'GET',
      `/v1/sdk/db/records/${recordId}`
    );
  }

  async update(
    recordId: string,
    data: Record<string, unknown>
  ): Promise<KoolbaseRecord> {
    return this.request<KoolbaseRecord>(
      'PATCH',
      `/v1/sdk/db/records/${recordId}`,
      { data }
    );
  }

  async delete(recordId: string): Promise<void> {
    const res = await fetch(
      `${this.config.baseUrl}/v1/sdk/db/records/${recordId}`,
      { method: 'DELETE', headers: this.headers }
    );
    if (!res.ok && res.status !== 204) {
      const data = await res.json();
      throw new Error(data.error ?? `Delete failed: ${res.status}`);
    }
  }
}
