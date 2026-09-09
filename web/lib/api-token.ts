import { SignJWT, jwtVerify } from 'jose';

/**
 * Bearer tokens for the mobile client.
 *
 * The web app authenticates with NextAuth cookies, which a native app cannot use, so
 * the login and signup routes additionally mint a short-lived signed token that the
 * mobile client sends as `Authorization: Bearer <token>`.
 *
 * Signed with NEXTAUTH_SECRET so there is one secret to rotate, and scoped with a
 * dedicated audience so an API token can never be mistaken for a session token.
 */
const AUDIENCE = 'betedge:mobile-api';
const ISSUER = 'betedge:web';
const TOKEN_TTL = '30d';

function secretKey(): Uint8Array {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('NEXTAUTH_SECRET is not set');
  return new TextEncoder().encode(secret);
}

export async function signApiToken(userId: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(secretKey());
}

/** Returns the user id the token was issued for, or null if it is absent or invalid. */
export async function userIdFromBearer(request: Request): Promise<string | null> {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  try {
    const { payload } = await jwtVerify(header.slice(7).trim(), secretKey(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    return typeof payload.sub === 'string' ? payload.sub : null;
  } catch {
    return null;
  }
}
