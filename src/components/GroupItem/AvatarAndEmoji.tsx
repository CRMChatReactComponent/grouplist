import { FC, useMemo } from "react";
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

export const AVATAR_SIZE = 32;

const EmojiDiv = styled.div<{ $disabled: boolean }>`
  width: ${AVATAR_SIZE}px;
  height: ${AVATAR_SIZE}px;
  font-size: ${AVATAR_SIZE}px;
  line-height: ${AVATAR_SIZE}px;
  cursor: ${(p) => (p.$disabled ? "default" : "pointer")};
`;

const AvatarDiv = styled.div`
  position: relative;
  width: ${AVATAR_SIZE}px;
  height: ${AVATAR_SIZE}px;
`;

const AbsoluteEmojiDiv = styled.div<{ $disabled: boolean }>`
  position: absolute;
  right: -7px;
  top: -3px;
  width: ${AVATAR_SIZE / 2}px;
  height: ${AVATAR_SIZE / 2}px;
  font-size: ${AVATAR_SIZE / 2}px;
  line-height: ${AVATAR_SIZE / 2}px;
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
            size={AVATAR_SIZE}
          />
        </EmojiDiv>
      </EmojiPickerWrapper>
    );
  }

  if (isHaveAvatar) {
    return (
      <AvatarDiv>
        <img src={avatar} width={AVATAR_SIZE} height={AVATAR_SIZE} />
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
                size={AVATAR_SIZE / 2.2}
              />
            </AbsoluteEmojiDiv>
          </EmojiPickerWrapper>
        )}
      </AvatarDiv>
    );
  }
};

export default AvatarAndEmoji;
