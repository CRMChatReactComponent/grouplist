import viteConfig from "./vite.config";
import { defineConfig, mergeConfig } from "vitest/config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      exclude: ["storybook-static/**"],
      include: ["./src/__tests__/**/*.test.{tsx,ts}"],
      environment: "jsdom",
      coverage: {
        provider: "v8",
        exclude: ["storybook-static/**", "src/stories/**"],
        include: ["src/**/*.tsx"],
      },
    },
  }),
);
