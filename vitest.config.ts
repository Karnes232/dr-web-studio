import path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    // Mirror the `@/` -> `src/` alias from tsconfig so tests can import
    // modules that use it.
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // `server-only` is a Next.js bundler marker with no real module behind
      // it; point it at a stub so server modules can be tested directly.
      "server-only": path.resolve(__dirname, "./test/stubs/server-only.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
})
