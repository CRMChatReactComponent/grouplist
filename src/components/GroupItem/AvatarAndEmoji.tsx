import { FC, useMemo } from "react";
import { Avatar } from "antd";
import EmojiPickerWrapper from "@/components/EmojiPickerWrapper";
import { US } from "@/types";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import styled from "styled-components";

type SourceType = undefined | string;

type AvatarAndEmojiProps = {
  avatar: US<string>;
  emoji: US<string>;
  avatarOnly?: boolean;
  allowDelete?: boolean;
  disabled?: boolean;
  defaultEmoji?: string;
  onEmojiChange?: (source: SourceType) => void;
};

const SIZE = 42;

const EmojiDiv = styled.div<{ $disabled: boolean }>`
  width: ${SIZE}px;
  height: ${SIZE}px;
  font-size: ${SIZE}px;
  line-height: ${SIZE}px;
  cursor: ${(p) => (p.$disabled ? "default" : "pointer")};
`;

const AvatarDiv = styled.div`
  position: relative;
  width: ${SIZE}px;
  height: ${SIZE}px;
`;

const AbsoluteEmojiDiv = styled.div<{ $disabled: boolean }>`
  position: absolute;
  right: -7px;
  top: -7px;
  width: ${SIZE / 2}px;
  height: ${SIZE / 2}px;
  font-size: ${SIZE / 2}px;
  line-height: ${SIZE / 2}px;
  cursor: ${(p) => (p.$disabled ? "default" : "pointer")};
`;

const AvatarAndEmoji: FC<AvatarAndEmojiProps> = ({
  avatar,
  emoji,
  avatarOnly = false,
  disabled = false,
  allowDelete = false,
  defaultEmoji = "1f4c1",
  onEmojiChange = () => {},
}) => {
  const isHaveAvatar = useMemo(() => !!avatar, [avatar]);
  const emojiText = useMemo(() => emoji ?? defaultEmoji, [emoji, defaultEmoji]);

  function handleEmojiChange(emoji) {
    onEmojiChange(emoji ? emoji : undefined);
  }

  if (!isHaveAvatar) {
    return (
      <EmojiPickerWrapper
        onSelect={handleEmojiChange}
        allowDelete={allowDelete}
        disabled={disabled}
      >
        <EmojiDiv $disabled={disabled}>
          <Emoji
            unified={emojiText}
            emojiStyle={EmojiStyle.FACEBOOK}
            size={SIZE}
          />
        </EmojiDiv>
      </EmojiPickerWrapper>
    );
  }

  if (isHaveAvatar) {
    return (
      <AvatarDiv>
        <Avatar draggable={false} src={avatar} alt={"None"} size={SIZE} />
        {!avatarOnly && (
          <EmojiPickerWrapper
            onSelect={handleEmojiChange}
            allowDelete={allowDelete}
            disabled={disabled}
          >
            <AbsoluteEmojiDiv $disabled={disabled}>
              <Emoji
                unified={emojiText}
                emojiStyle={EmojiStyle.FACEBOOK}
                size={SIZE / 2}
              />
            </AbsoluteEmojiDiv>
          </EmojiPickerWrapper>
        )}
      </AvatarDiv>
    );
  }
};

export default AvatarAndEmoji;
