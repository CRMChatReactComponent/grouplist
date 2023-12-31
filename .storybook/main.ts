import { r } from "../scripts/utils";
import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";
import { loadConfigFromFile, mergeConfig } from "vite";
import { GenI18nTypes } from "vite-i18n-gen-resources-type";
import tsconfigPaths from "vite-tsconfig-paths";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-storysource",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: false,
  },
  async viteFinal(config) {
    config?.plugins?.push(
      ...[
        GenI18nTypes({
          watchFolder: `${r("src/i18n/locales")}`,
          outputFolder: `${r("src/i18n")}`,
        }),
        /** @see https://github.com/aleclarson/vite-tsconfig-paths */
        tsconfigPaths({
          projects: [r("tsconfig.json")],
        }),
      ],
    );

    return config;
  },
};
export default config;
