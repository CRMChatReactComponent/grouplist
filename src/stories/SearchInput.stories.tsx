import SearchInput from "@/components/SearchInput";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "SearchInput",
  component: SearchInput,
  argTypes: {},
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: {},
};
