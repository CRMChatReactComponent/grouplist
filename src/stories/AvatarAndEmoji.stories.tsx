import { useState } from "react";
import { Typography } from "antd";
import { omit } from "lodash-es";
import { fn } from "storybook/test";
import AvatarAndEmoji from "../components/GroupItem/AvatarAndEmoji";
import { GroupItemTypeEnum } from "../enums";
import type { Meta, StoryObj } from "@storybook/react";

const { Text } = Typography;

const meta = {
  title: "AvatarAndEmoji",
  component: AvatarAndEmoji,
  args: {
    onEmojiChange: fn(),
  },
  render(props) {
    const [emoji, setEmoji] = useState(props.emoji);

    function handleEmojiChange(emoji) {
      setEmoji(emoji);
      props?.onEmojiChange?.(emoji);
    }

    return (
      <div style={{ padding: 42 }}>
        <AvatarAndEmoji
          {...omit(props, ["onEmojiChange", "emoji"])}
          emoji={emoji}
          onEmojiChange={handleEmojiChange}
        />
      </div>
    );
  },
} satisfies Meta<typeof AvatarAndEmoji>;

export default meta;
type Story = StoryObj<typeof AvatarAndEmoji>;

export const WithAvatarAndEmoji: Story = {
  args: {
    avatar: "https://avatars.githubusercontent.com/u/24644246?v=4",
    emoji: "1f4c1",
  },
};

export const AvatarOnly: Story = {
  args: {
    avatar: "https://avatars.githubusercontent.com/u/24644246?v=4",
    avatarOnly: true,
  },
};

export const EmojiOnly: Story = {
  args: {
    emoji: "1f4c1",
  },
};
