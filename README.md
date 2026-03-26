# koolbase-react-native

React Native SDK for [Koolbase](https://koolbase.com) — auth, database, storage, realtime, feature flags, and functions in one package.

## Installation
```bash
npm install koolbase-react-native
# or
yarn add koolbase-react-native
```

## Setup
```typescript
import { Koolbase } from 'koolbase-react-native';

await Koolbase.initialize({
  publicKey: 'pk_live_your_key_here',
  baseUrl: 'https://api.koolbase.com',
});
```

## Auth
```typescript
await Koolbase.auth.register({ email: 'user@example.com', password: 'password' });
await Koolbase.auth.login({ email: 'user@example.com', password: 'password' });
const user = Koolbase.auth.currentUser;
await Koolbase.auth.logout();
```

## Database
```typescript
await Koolbase.db.insert('posts', { title: 'Hello', published: true });
const { records } = await Koolbase.db.query('posts', { filters: { published: true }, limit: 10 });
await Koolbase.db.update('record-id', { title: 'Updated' });
await Koolbase.db.delete('record-id');

// Populate related records
const { records } = await Koolbase.db.query('posts', {
  populate: ['author_id:users'],
});
```

## Storage
```typescript
const { url } = await Koolbase.storage.upload({
  bucket: 'avatars',
  path: 'user-123.jpg',
  file: { uri: fileUri, name: 'avatar.jpg', type: 'image/jpeg' },
});
```

## Feature Flags
```typescript
if (Koolbase.isEnabled('new_checkout')) {
  // show new checkout
}
const timeout = Koolbase.configNumber('timeout_seconds', 30);
```

## Functions
```typescript
const result = await Koolbase.functions.invoke('send-email', {
  email: 'user@example.com',
});
```

## Documentation

Full docs at [docs.koolbase.com](https://docs.koolbase.com)

## License

MIT
