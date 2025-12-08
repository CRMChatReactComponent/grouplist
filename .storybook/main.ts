import { r } from "../scripts/utils";
import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";
import { loadConfigFromFile, mergeConfig } from "vite";
import { GenI18nTypes } from "vite-i18n-gen-resources-type";
import tsconfigPaths from "vite-tsconfig-paths";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
   "@storybook/addon-docs",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: false,
  },
  async viteFinal(config) {
    // 添加自定义插件处理 .md?raw 导入
    config?.plugins?.push(
      ...[
        {
          name: "vite-plugin-raw-md",
          enforce: "pre",
          resolveId(id) {
            if (id.endsWith(".md?raw")) {
              return id;
            }
          },
          async load(id) {
            if (id.endsWith(".md?raw")) {
              const fs = await import("fs");
              const filePath = id.replace("?raw", "");
              const content = fs.readFileSync(filePath, "utf-8");
              return `export default ${JSON.stringify(content)};`;
            }
          },
        },
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
