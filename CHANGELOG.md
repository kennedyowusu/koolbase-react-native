## 1.1.0

- **Database:** Offline-first support powered by AsyncStorage
  - Cache-first reads — returns local data instantly, refreshes from network in background
  - Optimistic writes — inserts saved locally first, synced when online
  - Auto-sync on network reconnect via NetInfo
  - `Koolbase.db.syncPendingWrites()` — manually trigger sync
  - `QueryResult.isFromCache` flag — know whether data came from cache or network
  - Write queue with max 3 retries before dropping failed writes
  - User-scoped cache — no cross-user data leakage on shared devices
  - `PendingWrite` type exported from package

## 1.0.0

- Initial release
- Auth — register, login, logout, current user
- Database — insert, query, get, update, delete, populate
- Storage — upload, download, delete
- Realtime — WebSocket subscriptions
- Functions — invoke deployed functions
- Feature flags and remote config
- Version enforcement
