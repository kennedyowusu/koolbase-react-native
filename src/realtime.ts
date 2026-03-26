import { KoolbaseConfig, RealtimeCallback, RealtimeEvent } from './types';

export class KoolbaseRealtime {
  private config: KoolbaseConfig;
  private ws: WebSocket | null = null;
  private listeners: Map<string, RealtimeCallback[]> = new Map();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(config: KoolbaseConfig) {
    this.config = config;
  }

  subscribe(collection: string, callback: RealtimeCallback): () => void {
    if (!this.listeners.has(collection)) {
      this.listeners.set(collection, []);
    }
    this.listeners.get(collection)!.push(callback);

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.connect();
    }

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(collection) ?? [];
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    };
  }

  private connect(): void {
    const wsUrl = this.config.baseUrl
      .replace('https://', 'wss://')
      .replace('http://', 'ws://');

    this.ws = new WebSocket(
      `${wsUrl}/v1/sdk/realtime?key=${this.config.publicKey}`
    );

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as RealtimeEvent;
        const callbacks = this.listeners.get(msg.collection) ?? [];
        callbacks.forEach((cb) => cb(msg));
      } catch (_) {}
    };

    this.ws.onclose = () => {
      this.reconnectTimer = setTimeout(() => this.connect(), 3000);
    };
  }

  disconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
    this.listeners.clear();
  }
}
