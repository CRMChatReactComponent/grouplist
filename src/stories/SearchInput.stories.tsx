import { fn } from "storybook/test";
import SearchInput from "@/components/SearchInput";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "SearchInput",
  component: SearchInput,
  args: {
    onSearch: fn(),
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: {},
};
