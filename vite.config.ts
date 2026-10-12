import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const snippetVerificationTimeoutMs = 120_000;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "snippets",
          include: ["verification/**/*.verify.ts"],
          testTimeout: snippetVerificationTimeoutMs,
        },
      },
    ],
  },
});
