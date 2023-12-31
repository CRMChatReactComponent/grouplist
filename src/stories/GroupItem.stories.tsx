import { useState } from "react";
import { Typography } from "antd";
import GroupItem from "../components/GroupItem/index";
import { GroupItemTypeEnum } from "../enums";
import type { Meta, StoryObj } from "@storybook/react";

const { Text } = Typography;

const meta = {
  title: "GroupItem",
  component: GroupItem,
  argTypes: {},
  render(props) {
    const [_, update] = useState(0);

    function handleDataChange(data) {
      Object.assign(props.data, data);
      update(Math.random());
      props?.onDataChange?.(data);
    }

    return (
      <div style={{ width: 320 }}>
        <GroupItem
          {...props}
          onDataChange={handleDataChange}
          actionDropdownMenu={{
            items: [
              {
                label: "foo",
                key: "bar",
              },
            ],
            onClick(ev) {
              console.log(ev, 999);
            },
          }}
          SlotExtraInformation={<div>123</div>}
        />
      </div>
    );
  },
} satisfies Meta<typeof GroupItem>;

export default meta;
type Story = StoryObj<typeof GroupItem>;

export const Basic: Story = {
  args: {
    data: {
      type: GroupItemTypeEnum.USER,
      title: "123",
      emoji: undefined,
      message: "abbb",
      avatar: undefined,
      backgroundColor: undefined,
      readonly: false,
      order: 0,
    },
  },
};
