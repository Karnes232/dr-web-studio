// Next.js resolves the `server-only` marker package through its own bundler
// alias, so it does not exist in node_modules. Vitest maps it here instead,
// letting server-side modules be unit-tested directly.
export {}
