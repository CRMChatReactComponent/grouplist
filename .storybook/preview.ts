import withCanvasDecorators from "./decorators/withCanvasDecorators";
import type { Preview } from "@storybook/react";
import { themes } from "@storybook/theming";

const preview: Preview = {
  parameters: {
    backgrounds: { disable: true, grid: { disable: true } },
    layout: "fullscreen",
    actions: { argTypesRegex: "^on.*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: themes.dark,
    },
  },
  decorators: [withCanvasDecorators],
};

export default preview;
