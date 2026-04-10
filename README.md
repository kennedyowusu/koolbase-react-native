# Koolbase React Native SDK

⚠️ ## This package has moved

This package is deprecated.

👉 Install the official version:

```bash
npm install @techfinityedge/koolbase-react-native
```

---

[![npm](https://img.shields.io/npm/v/koolbase-react-native.svg)](https://www.npmjs.com/package/koolbase-react-native)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

React Native SDK for [Koolbase](https://koolbase.com) — Backend as a Service built for mobile developers.

Auth, database, storage, realtime, functions, feature flags, remote config, version enforcement, code push, logic engine, analytics, and cloud messaging — one SDK, one `initialize()` call.

---

## Get started in 2 minutes

1. Create a free account at [app.koolbase.com](https://app.koolbase.com)

2. Create a project and copy your public key from Environments

3. Add the SDK:

```bash
npm install koolbase-react-native
# or
yarn add koolbase-react-native
```

**4. Initialize at app startup:**

```typescript
import { Koolbase } from 'koolbase-react-native';

await Koolbase.initialize({
  publicKey: 'pk_live_xxxx',
  baseUrl: 'https://api.koolbase.com',
});
```

That's it. Every feature below is now available via `Koolbase.*`.

---

## Authentication

```typescript
// Register
await Koolbase.auth.register({ email: 'user@example.com', password: 'password' });

// Login
const session = await Koolbase.auth.login({ email: 'user@example.com', password: 'password' });

// Current user
const me = Koolbase.auth.currentUser;

// Logout
await Koolbase.auth.logout();

// Password reset
await Koolbase.auth.forgotPassword('user@example.com');
```

---

## Database

```typescript
// Insert
await Koolbase.db.insert('posts', { title: 'Hello', published: true });

// Query
const { records } = await Koolbase.db.query('posts', {
  filters: { published: true },
  limit: 10,
  orderBy: 'created_at',
  orderDesc: true,
});

// Populate related records
const { records } = await Koolbase.db.query('posts', {
  populate: ['author_id:users'],
});

// Update / Delete
await Koolbase.db.update('record-id', { title: 'Updated' });
await Koolbase.db.delete('record-id');
```

### Offline-first

```typescript
const { records, isFromCache } = await Koolbase.db.query('posts', { limit: 20 });
if (isFromCache) console.log('Served from local cache');

await Koolbase.db.syncPendingWrites();
```

---

## Storage

```typescript
const { url } = await Koolbase.storage.upload({
  bucket: 'avatars',
  path: `user-${userId}.jpg`,
  file: { uri: imageUri, name: 'avatar.jpg', type: 'image/jpeg' },
});

const downloadUrl = await Koolbase.storage.getDownloadUrl('avatars', `user-${userId}.jpg`);
await Koolbase.storage.delete('avatars', `user-${userId}.jpg`);
```

---

## Realtime

```typescript
const unsubscribe = Koolbase.realtime.subscribe('messages', (event) => {
  if (event.type === 'created') setMessages(prev => [event.record, ...prev]);
});

// Cleanup
unsubscribe();
```

---

## Feature Flags & Remote Config

```typescript
if (Koolbase.isEnabled('new_checkout')) { ... }

const timeout = Koolbase.configNumber('timeout_seconds', 30);
const apiUrl = Koolbase.configString('api_url', 'https://api.myapp.com');
const dark = Koolbase.configBool('force_dark_mode', false);
```

---

## Version Enforcement

```typescript
const result = Koolbase.checkVersion('1.2.3');
if (result.status === 'force_update') {
  // block and show update screen
}
```

---

## Code Push

```typescript
await Koolbase.initialize({
  publicKey: 'pk_live_xxxx',
  baseUrl: 'https://api.koolbase.com',
  codePushChannel: 'stable',
});

// Bundle values override Remote Config + Feature Flags transparently
const timeout = Koolbase.configNumber('api_timeout_ms', 3000);

// Directive handlers
Koolbase.codePush.onDirective('force_logout_all', (value) => {
  if (value) Koolbase.auth.logout();
});
Koolbase.codePush.applyDirectives();
```

---

## Logic Engine

```typescript
// Define flows in your bundle's flows.json
// Execute from anywhere in your app
const result = Koolbase.executeFlow('on_checkout_tap', { plan: user.plan });

if (result.hasEvent) {
  switch (result.eventName) {
    case 'show_upgrade': navigation.navigate('Upgrade'); break;
    case 'go_checkout': navigation.navigate('Checkout'); break;
  }
}
```

---

## Analytics

```typescript
await Koolbase.initialize({
  publicKey: 'pk_live_xxxx',
  baseUrl: 'https://api.koolbase.com',
  analyticsEnabled: true,
  appVersion: '1.0.0',
});

// Custom events
Koolbase.analytics.track('purchase', { value: 1200, currency: 'GHS' });

// Screen views
Koolbase.analytics.screenView('checkout');

// User identity
Koolbase.analytics.identify(user.id);
Koolbase.analytics.setUserProperty('plan', 'pro');

// On logout
Koolbase.analytics.reset();
```

---

## Cloud Messaging

```typescript
await Koolbase.initialize({
  publicKey: 'pk_live_xxxx',
  baseUrl: 'https://api.koolbase.com',
  messagingEnabled: true,
});

// Register FCM token (after obtaining from @react-native-firebase/messaging)
const fcmToken = await messaging().getToken();
await Koolbase.messaging.registerToken({
  token: fcmToken,
  platform: 'android', // or 'ios'
});

// Send to a specific device
await Koolbase.messaging.send({
  to: deviceToken,
  title: 'Your order is ready',
  body: 'Pick up at counter 3',
  data: { order_id: '123' },
});
```

---

## Logic Engine v2

```typescript
const result = Koolbase.executeFlow('on_checkout_tap', {
  plan: user.plan,
  usage: user.usage,
});

if (result.hasEvent) {
  switch (result.eventName) {
    case 'show_upgrade': navigation.navigate('Upgrade'); break;
    case 'go_checkout': navigation.navigate('Checkout'); break;
  }
}
```

**v2 operators:** `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `contains`, `starts_with`, `ends_with`, `in_list`, `not_in_list`, `between`, `is_true`, `is_false`, `exists`, `not_exists`, `and`, `or`

Full docs at [docs.koolbase.com/sdk/logic-engine](https://docs.koolbase.com/sdk/logic-engine).

---

## Sign in with Apple

```typescript
import { KoolbaseAppleAuth } from 'koolbase-react-native';
import { appleAuth } from '@invertase/react-native-apple-authentication';

const session = await KoolbaseAppleAuth.signIn(async () => {
  return await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });
});
```

Install `@invertase/react-native-apple-authentication` as a peer dependency. Full setup guide at [docs.koolbase.com/auth/oauth](https://docs.koolbase.com/auth/oauth).

---

## Documentation

Full documentation at [docs.koolbase.com](https://docs.koolbase.com)

## Dashboard

Manage your projects at [app.koolbase.com](https://app.koolbase.com)

## Support

- [GitHub Issues](https://github.com/kennedyowusu/koolbase-react-native/issues)
- [docs.koolbase.com](https://docs.koolbase.com)
- Email: hello@koolbase.com

## License

MIT
