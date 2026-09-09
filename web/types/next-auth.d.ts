import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      subscriptionTier: string;
    } & DefaultSession['user']; // includes name, email, image
  }

  interface User {
    id: string;
    subscriptionTier?: string;
  }
}

// next-auth v5 re-exports the JWT interface from @auth/core, so the augmentation has
// to target that module — augmenting 'next-auth/jwt' alone does not merge into it.
declare module '@auth/core/jwt' {
  interface JWT {
    id?: string;
    subscriptionTier?: string;
  }
}
