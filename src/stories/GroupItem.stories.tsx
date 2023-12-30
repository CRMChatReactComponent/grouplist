import { useState } from "react";
import { Typography, Checkbox } from "antd";
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
        <GroupItem {...props} onDataChange={handleDataChange} />
      </div>
    );
  },
} satisfies Meta<typeof GroupItem>;

export default meta;
type Story = StoryObj<typeof GroupItem>;

export const Group: Story = {
  args: {
    data: {
      id: "2",
      type: GroupItemTypeEnum.GROUP,
      title: "123",
      emoji: undefined,
      message: "abbb",
      avatar: undefined,
      backgroundColor: undefined,
      readonly: false,
    },
    actionDropdownMenu: {
      items: [
        {
          label: "foo",
          key: "bar",
        },
      ],
      onClick(ev) {
        console.log(ev, 999);
      },
    },
    SlotExtraInformation: () => <span style={{ fontSize: 12 }}>成员: 24</span>,
    SlotTopRightAreaLeft: () => <Checkbox />,
    SlotBottomRightArea: () => <Checkbox />,
  },
};

export const User: Story = {
  args: {
    data: {
      id: "1",
      type: GroupItemTypeEnum.USER,
      title: "123",
      emoji: undefined,
      message: "abbb",
      avatar: "https://avatars.githubusercontent.com/u/24644246?v=4",
      backgroundColor: undefined,
      readonly: false,
    },
    actionDropdownMenu: {
      items: [
        {
          label: "foo",
          key: "bar",
        },
      ],
      onClick(ev) {
        console.log(ev, 999);
      },
    },
    SlotTopRightAreaLeft: () => <Checkbox />,
    SlotBottomRightArea: () => <Checkbox />,
  },
};
