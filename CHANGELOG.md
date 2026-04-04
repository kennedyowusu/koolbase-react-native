## 1.3.0

### Analytics
- Added `KoolbaseAnalytics` — event tracking with batched flush
- Added `Koolbase.analytics` — top-level accessor
- Added `Koolbase.analytics.track(eventName, properties)` — custom event tracking
- Added `Koolbase.analytics.screenView(screenName, properties)` — screen view tracking
- Added `Koolbase.analytics.identify(userId)` — attach authenticated user
- Added `Koolbase.analytics.setUserProperty(key, value)` — user property
- Added `Koolbase.analytics.setUserProperties(map)` — bulk user properties
- Added `Koolbase.analytics.reset()` — clear identity on logout
- Added `Koolbase.analytics.flush()` — manual flush
- Added `Koolbase.analytics.dispose()` — flush and shut down
- Auto events: `app_open`, `screen_view`, `session_end`
- Batch flush: every 30s, on app background, on close, or at 20 events
- Anonymous by default (stable device_id via AsyncStorage), attach user_id on identify()
- `KoolbaseConfig` extended with `analyticsEnabled` and `appVersion` parameters

### Logic Engine v1
- Added `Koolbase.executeFlow(flowId, context)` — evaluate named flow from active bundle
- Added `KoolbaseLogicEngine` — safe, deterministic flow evaluator
- Supported node types: `if`, `sequence`, `event` (terminal), `set`
- Supported operators: `eq`, `neq`, `gt`, `lt`, `and`, `or`, `exists`
- Supported data sources: `context` (app-provided), `config` (bundle), `flags` (bundle)
- `BundlePayload` extended with `flows` and `screens` fields
- Never throws — returns safe `FlowResult` on any error

### Usage
```typescript
// Analytics
await Koolbase.initialize({
  publicKey: 'pk_live_xxx',
  baseUrl: 'https://api.koolbase.com',
  appVersion: '1.0.0',
  analyticsEnabled: true,
});

Koolbase.analytics.track('purchase', { value: 1200, currency: 'GHS' });
Koolbase.analytics.screenView('checkout');
Koolbase.analytics.identify(user.id);
Koolbase.analytics.setUserProperty('plan', 'pro');

// Logic Engine
const result = Koolbase.executeFlow('on_checkout_tap', { plan: user.plan });
if (result.hasEvent) navigation.navigate(result.eventName!);
```

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
