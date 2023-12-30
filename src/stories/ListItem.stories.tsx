import {
  createRef,
  ReactNode,
  useEffect,
  useRef,
  useState,
  ElementRef,
} from "react";
import { Button, Radio, Space, Typography } from "antd";
import ListItem, { ListItemPropsType } from "../components/ListItem";
import type { Meta, StoryObj } from "@storybook/react";

const { Text } = Typography;

const meta = {
  title: "ListItem",
  component: ListItem,
  render: (props, context) => {
    type CountdownHandle = ElementRef<typeof ListItem>;
    const ListItemRef = useRef<CountdownHandle>(null);

    useEffect(() => {
      context?.setMethodsPanel?.(
        <Space direction={"vertical"} size={12}>
          <Space direction={"vertical"} size={4}>
            <Button onClick={() => ListItemRef?.current?.clear()}>清空</Button>
          </Space>
        </Space>,
      );
    }, []);

    return <ListItem {...props} ref={ListItemRef} />;
  },
} satisfies Meta<typeof ListItem>;

export default meta;
type Story = StoryObj<typeof ListItem>;

export const Basic: Story = {
  args: {},
};
