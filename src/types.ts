export interface KoolbaseConfig {
  publicKey: string;
  baseUrl: string;
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export interface KoolbaseUser {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  verified: boolean;
  createdAt: string;
}

export interface KoolbaseSession {
  accessToken: string;
  refreshToken: string;
  user: KoolbaseUser;
}

export interface RegisterParams {
  email: string;
  password: string;
  fullName?: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

// ─── Database ──────────────────────────────────────────────────────────────

export interface KoolbaseRecord {
  id: string;
  projectId: string;
  collectionId: string;
  createdBy?: string;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface QueryOptions {
  filters?: Record<string, unknown>;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDesc?: boolean;
  populate?: string[];
}

export interface QueryResult {
  records: KoolbaseRecord[];
  total: number;
  isFromCache?: boolean;
}

export interface PendingWrite {
  id: string;
  type: 'insert' | 'update' | 'delete';
  collection?: string;
  recordId?: string;
  data?: Record<string, unknown>;
  retries: number;
  createdAt: string;
}

// ─── Storage ───────────────────────────────────────────────────────────────

export interface UploadOptions {
  bucket: string;
  path: string;
  file: {
    uri: string;
    name: string;
    type: string;
  };
  onProgress?: (percent: number) => void;
}

// ─── Realtime ──────────────────────────────────────────────────────────────

export interface RealtimeEvent {
  type: 'created' | 'updated' | 'deleted';
  collection: string;
  record: KoolbaseRecord;
}

export type RealtimeCallback = (event: RealtimeEvent) => void;

// ─── Feature Flags / Config ────────────────────────────────────────────────

export interface BootstrapPayload {
  payload_version: string;
  flags: Record<string, {
    enabled: boolean;
    rollout_percentage: number;
    kill_switch: boolean;
  }>;
  config: Record<string, unknown>;
  version: {
    min_version: string;
    latest_version: string;
    force_update: boolean;
    update_message: string;
  };
}

export type VersionStatus = 'up_to_date' | 'soft_update' | 'force_update';

export interface VersionCheckResult {
  status: VersionStatus;
  message: string;
  latestVersion: string;
}

// ─── Functions ─────────────────────────────────────────────────────────────

export enum FunctionRuntime {
  Deno = 'deno',
  Dart = 'dart',
}

export interface DeployOptions {
  name: string;
  code: string;
  runtime?: FunctionRuntime;
  timeoutMs?: number;
}

export interface DeployResult {
  id: string;
  name: string;
  runtime: string;
  version: number;
  isActive: boolean;
  timeoutMs: number;
  lastDeployedAt: string | null;
}

export interface FunctionInvokeResult {
  statusCode: number;
  data: Record<string, unknown> | null;
  success: boolean;
}
