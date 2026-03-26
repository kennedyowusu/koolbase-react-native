import { KoolbaseConfig, FunctionInvokeResult } from './types';

export class KoolbaseFunctions {
  private config: KoolbaseConfig;

  constructor(config: KoolbaseConfig) {
    this.config = config;
  }

  async invoke(
    name: string,
    body?: Record<string, unknown>
  ): Promise<FunctionInvokeResult> {
    const res = await fetch(
      `${this.config.baseUrl}/v1/sdk/functions/${name}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.publicKey,
        },
        body: JSON.stringify({ body: body ?? {} }),
      }
    );

    const data = await res.json().catch(() => null);
    const success = res.status >= 200 && res.status < 300;

    if (!success) {
      throw new Error(
        (data as Record<string, unknown>)?.error as string ??
          'Function invocation failed'
      );
    }

    return {
      statusCode: res.status,
      data: data as Record<string, unknown>,
      success,
    };
  }
}
