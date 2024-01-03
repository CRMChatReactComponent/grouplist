import { useState } from "react";
import { Typography, Checkbox } from "antd";
import GroupList from "../components/GroupList/index";
import { GroupItemTypeEnum } from "../enums/index";
import { genMockTreeData } from "./helpers/genMockTreeDataHelper";
import type { Meta, StoryObj } from "@storybook/react";

const { Text } = Typography;

const meta = {
  title: "GroupList",
  component: GroupList,
  argTypes: {},
  render(props) {
    return (
      <div style={{ width: 420 }}>
        <GroupList {...props} />
      </div>
    );
  },
} satisfies Meta<typeof GroupList>;

export default meta;
type Story = StoryObj<typeof GroupList>;

const mockTreeData = genMockTreeData();
export const Basic: Story = {
  args: {
    data: mockTreeData,
  },
};
