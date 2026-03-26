import { KoolbaseAuth } from './auth';
import { KoolbaseDatabase } from './database';
import { KoolbaseFlags } from './flags';
import { KoolbaseFunctions } from './functions';
import { KoolbaseRealtime } from './realtime';
import { KoolbaseStorage } from './storage';
import { KoolbaseConfig, VersionCheckResult } from './types';

export * from './types';
export { KoolbaseAuth, KoolbaseDatabase, KoolbaseFlags, KoolbaseFunctions, KoolbaseRealtime, KoolbaseStorage };

let _auth: KoolbaseAuth | null = null;
let _db: KoolbaseDatabase | null = null;
let _storage: KoolbaseStorage | null = null;
let _realtime: KoolbaseRealtime | null = null;
let _functions: KoolbaseFunctions | null = null;
let _flags: KoolbaseFlags | null = null;
let _initialized = false;

function ensureInitialized() {
  if (!_initialized) {
    throw new Error('Koolbase not initialized. Call Koolbase.initialize() first.');
  }
}

export const Koolbase = {
  async initialize(config: KoolbaseConfig): Promise<void> {
    if (_initialized) return;

    _auth = new KoolbaseAuth(config);
    _db = new KoolbaseDatabase(config, () => _auth?.currentUser?.id ?? null);
    _storage = new KoolbaseStorage(config, () => _auth?.accessToken ?? null);
    _realtime = new KoolbaseRealtime(config);
    _functions = new KoolbaseFunctions(config);
    _flags = new KoolbaseFlags(config, 'rn-device');

    _initialized = true;
  },

  get auth(): KoolbaseAuth {
    ensureInitialized();
    return _auth!;
  },

  get db(): KoolbaseDatabase {
    ensureInitialized();
    return _db!;
  },

  get storage(): KoolbaseStorage {
    ensureInitialized();
    return _storage!;
  },

  get realtime(): KoolbaseRealtime {
    ensureInitialized();
    return _realtime!;
  },

  get functions(): KoolbaseFunctions {
    ensureInitialized();
    return _functions!;
  },

  isEnabled(key: string): boolean {
    ensureInitialized();
    return _flags!.isEnabled(key);
  },

  configString(key: string, fallback = ''): string {
    ensureInitialized();
    return _flags!.getString(key, fallback);
  },

  configNumber(key: string, fallback = 0): number {
    ensureInitialized();
    return _flags!.getNumber(key, fallback);
  },

  configBool(key: string, fallback = false): boolean {
    ensureInitialized();
    return _flags!.getBool(key, fallback);
  },

  checkVersion(currentVersion: string): VersionCheckResult {
    ensureInitialized();
    return _flags!.checkVersion(currentVersion);
  },
};
