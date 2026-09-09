import { auth } from '@/auth';
import { userIdFromBearer } from '@/lib/api-token';

/**
 * Resolves the caller for a route handler, accepting either sign-in method:
 * the NextAuth session cookie the web app uses, or the bearer token the mobile
 * client holds. Returns null when neither identifies a user.
 */
export async function requireUserId(request: Request): Promise<string | null> {
  const session = await auth();
  if (session?.user?.id) return session.user.id;
  return userIdFromBearer(request);
}
