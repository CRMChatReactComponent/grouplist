import { useState } from "react";
import { Button, Space } from "antd";
import "antd";
import { omit } from "lodash-es";
import { fn } from "storybook/test";
import EmojiPickerWrapper from "../components/EmojiPickerWrapper";
import type { Meta, StoryObj } from "@storybook/react";
import { Emoji, EmojiStyle } from "emoji-picker-react";

const meta = {
  title: "EmojiPickerWrapper",
  component: EmojiPickerWrapper,
  args: {
    onSelect: fn(),
    onDelete: fn(),
    onOpenChange: fn(),
  },
  render(props) {
    const [emoji, setEmoji] = useState<string>();
    return (
      <div style={{ paddingLeft: 42 }}>
        <EmojiPickerWrapper
          {...omit(props, ["onSelect"])}
          onSelect={(emoji) => {
            setEmoji(emoji);
            props?.onSelect?.(emoji);
          }}
        >
          <Space size={12} align={"center"}>
            <div>
              {!!emoji && (
                <Emoji
                  unified={emoji}
                  emojiStyle={EmojiStyle.FACEBOOK}
                  size={32}
                />
              )}
            </div>
            <Button>显示图标选择器</Button>
          </Space>
        </EmojiPickerWrapper>
      </div>
    );
  },
} satisfies Meta<typeof EmojiPickerWrapper>;

export default meta;
type Story = StoryObj<typeof EmojiPickerWrapper>;

export const Basic: Story = {};
