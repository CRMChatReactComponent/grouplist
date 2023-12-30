// @ts-ignore
import { name } from "../package.json";
import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming";

addons.setConfig({
  theme: create({
    base: "dark",
    brandTitle: "GroupList 组件",
    brandUrl: 'https://github.com/CRMChatReactComponent',
  }),
});
