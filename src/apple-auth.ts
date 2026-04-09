/**
 * KoolbaseAppleAuth — Sign in with Apple for React Native
 *
 * Requires @invertase/react-native-apple-authentication
 * Install: npm install @invertase/react-native-apple-authentication
 *
 * Usage:
 * ```typescript
 * import { KoolbaseAppleAuth } from 'koolbase-react-native';
 * const session = await KoolbaseAppleAuth.signIn();
 * ```
 */
export class KoolbaseAppleAuth {
  static async signIn(
    getAppleCredential: () => Promise<{
      identityToken: string | null;
      email: string | null;
      fullName?: { givenName?: string | null; familyName?: string | null } | null;
    }>
  ): Promise<Record<string, unknown> | null> {
    try {
      const { Koolbase } = await import('./index');

      const credential = await getAppleCredential();

      if (!credential.identityToken) {
        console.warn('[KoolbaseAppleAuth] No identity token returned');
        return null;
      }

      const name = [credential.fullName?.givenName, credential.fullName?.familyName]
        .filter(Boolean)
        .join(' ');

      return await Koolbase.auth.oauthLogin({
        provider: 'apple',
        token: credential.identityToken,
        email: credential.email ?? '',
        name,
      });
    } catch (error) {
      console.error('[KoolbaseAppleAuth] Sign in failed:', error);
      return null;
    }
  }
}
