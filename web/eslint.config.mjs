// Flat ESLint config for `yarn lint` (`eslint .`). Next.js 16 removed `next lint`,
// so this file is the lint entry point; eslint-config-next 16 ships flat configs.
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  globalIgnores([
    '.next/**',
    '.build/**',
    'node_modules/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // CommonJS config files and the platform-managed error reporter: not app source,
    // and require()/IIFE style is correct for them.
    'next.config.js',
    'postcss.config.js',
    'instrumentation-client.js',
  ]),
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    // `set-state-in-effect` is a compiler diagnostic and cannot be silenced with an
    // inline disable comment, so the two accepted cases are scoped here instead.
    // Everywhere else the rule stays an error.
    //
    //  - client-only / app-footer: a mount flag *must* set state once after
    //    hydration; that is the whole point of the SSR-safety pattern that
    //    eslint.ssr.config.mjs points authors at.
    //  - alerts / tracker: fetch-on-mount against the route handlers. These pages
    //    read a NextAuth session client-side, so the data cannot be fetched in a
    //    server component without a wider refactor.
    files: [
      'components/client-only.tsx',
      'components/app-footer.tsx',
      'app/alerts/_components/alerts-content.tsx',
      'app/tracker/_components/tracker-content.tsx',
    ],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    // The SSR lint config is a flat-config array by design.
    files: ['eslint.ssr.config.mjs'],
    rules: { 'import/no-anonymous-default-export': 'off' },
  },
]);
