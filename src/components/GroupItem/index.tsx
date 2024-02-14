import { FC, useMemo } from "react";
import { Dropdown, DropdownProps } from "antd";
import AvatarAndEmoji, {
  AVATAR_SIZE,
} from "@/components/GroupItem/AvatarAndEmoji";
import Indicator from "@/components/GroupItem/Indicator";
import { DISABLED_ITEM_INTERACTION_CLASS } from "@/components/GroupItem/const";
import { useActionDropdownProps } from "@/components/GroupItem/hooks/useActionDropdownProps";
import { useGroupItemBackgroundColor } from "@/components/GroupItem/hooks/useGroupItemBackgroundColor";
import { GroupItemTypeEnum } from "@/enums";
import { useIsDark } from "@/hooks/useIsDark";
import { CancelableReturnType } from "@/types";
import {
  TopRightCornerBoxVertButton,
  Wrapper,
  CenterBox,
  TitleSpan,
  CenterTopBox,
  CenterBottomBox,
  MessageSpan,
  TopRightCornerBox,
  Container,
  SlotExtraInformationWrapper,
  SlotBottomRightAreaContainer,
  AvatarWrapper,
} from "./index.styled";
import { DefaultSlotType, GroupItemType } from "./type";
import { MoreOutlined } from "@ant-design/icons";

export type GroupItemPropsType = {
  data: GroupItemType;
  isExpanded?: boolean;
  isFocused?: boolean;
  isSelected?: boolean;
  //  右上角 vert 按钮点击后的下拉菜单
  actionDropdownMenu?: DropdownProps["menu"];
  onBeforeDelete?: (data: GroupItemType) => CancelableReturnType;
  onDeleted?: (data: GroupItemType) => void;
  onDataChange?: (data: GroupItemType) => void;
  SlotExtraInformation?: DefaultSlotType;
  SlotAvatarExtra?: DefaultSlotType;
  SlotTopRightAreaLeft?: DefaultSlotType;
  SlotTopRightAreaRight?: DefaultSlotType;
  SlotBottomRightArea?: DefaultSlotType;
};

const GroupItem: FC<GroupItemPropsType> = (props: GroupItemPropsType) => {
  const {
    data,
    isExpanded = false,
    isFocused = false,
    isSelected = false,
    actionDropdownMenu,
    onDataChange,
    onDeleted,
    onBeforeDelete,
    SlotExtraInformation,
    SlotTopRightAreaLeft,
    SlotTopRightAreaRight,
    SlotBottomRightArea,
    SlotAvatarExtra,
  }: GroupItemPropsType = props;
  const { title, message, backgroundColor, emoji, avatar, readonly } = data;

  const actionDropdownProps = useActionDropdownProps({
    data,
    actionDropdownMenu,
    onDeleted,
    onBeforeDelete,
    onColorChange(color: string) {
      handleDataValueChange("backgroundColor", color);
    },
    onTitleChange(title: string) {
      handleDataValueChange("title", title);
    },
  });

  const { bg, hoverBg, isDarkBgColor } =
    useGroupItemBackgroundColor(backgroundColor);
  const isDark = useIsDark();
  const isHaveMiddleInformation = useMemo(
    () => !!SlotExtraInformation,
    [SlotExtraInformation],
  );
  const defaultEmoji = useMemo(() => {
    return data.type === GroupItemTypeEnum.GROUP ? "1f4c1" : "1f466";
  }, [data.type]);

  function handleDataValueChange<T extends keyof GroupItemPropsType["data"]>(
    key: T,
    value: GroupItemPropsType["data"][T],
  ) {
    const payload = {
      ...props.data,
      [key]: value,
    };

    onDataChange?.(payload);
  }

  return (
    <Container $isDark={isDark}>
      <Indicator
        isExpanded={isExpanded}
        isFocused={isFocused}
        isSelected={isSelected}
        type={data.type}
      />
      <Wrapper
        $bg={bg}
        $bgHover={hoverBg}
        $isHaveMiddleInformation={isHaveMiddleInformation}
        $isDarkBg={isDarkBgColor}
      >
        <AvatarWrapper className={DISABLED_ITEM_INTERACTION_CLASS}>
          <AvatarAndEmoji
            avatar={avatar}
            emoji={emoji}
            defaultEmoji={defaultEmoji}
            allowDelete={true}
            disabled={readonly}
            avatarOnly={true}
            onEmojiChange={(emoji) => handleDataValueChange("emoji", emoji)}
          />
          {SlotAvatarExtra && (
            <SlotAvatarExtra
              isFocused={isFocused}
              isExpanded={isExpanded}
              isSelected={isSelected}
              data={data}
            />
          )}
        </AvatarWrapper>

        {/*中间区域(包含右上角的 vert*/}
        <CenterBox
          $space={AVATAR_SIZE + 18}
          $gap={isHaveMiddleInformation ? 4 : 8}
        >
          <CenterTopBox $marginTop={isHaveMiddleInformation ? -2 : 0}>
            <TitleSpan>{title}</TitleSpan>

            {/*右上角功能区域*/}
            <TopRightCornerBox className={DISABLED_ITEM_INTERACTION_CLASS}>
              {SlotTopRightAreaLeft && (
                <SlotTopRightAreaLeft
                  isFocused={isFocused}
                  isExpanded={isExpanded}
                  isSelected={isSelected}
                  data={data}
                />
              )}

              <TopRightCornerBoxVertButton>
                <Dropdown {...actionDropdownProps}>
                  <button>
                    <MoreOutlined style={{ fontSize: 16 }} />
                  </button>
                </Dropdown>
              </TopRightCornerBoxVertButton>

              {SlotTopRightAreaRight && (
                <SlotTopRightAreaRight
                  isFocused={isFocused}
                  isExpanded={isExpanded}
                  isSelected={isSelected}
                  data={data}
                />
              )}
            </TopRightCornerBox>
          </CenterTopBox>

          {/*额外信息注入*/}
          {SlotExtraInformation && (
            <SlotExtraInformationWrapper>
              <SlotExtraInformation
                isFocused={isFocused}
                isExpanded={isExpanded}
                isSelected={isSelected}
                data={data}
              />
            </SlotExtraInformationWrapper>
          )}

          {/*消息*/}
          <CenterBottomBox>
            <MessageSpan>{message}</MessageSpan>

            {/*右下角插槽*/}
            <div className={DISABLED_ITEM_INTERACTION_CLASS}>
              <SlotBottomRightAreaContainer>
                {SlotBottomRightArea && (
                  <SlotBottomRightArea
                    isFocused={isFocused}
                    isExpanded={isExpanded}
                    isSelected={isSelected}
                    data={data}
                  />
                )}
              </SlotBottomRightAreaContainer>
            </div>
          </CenterBottomBox>
        </CenterBox>
      </Wrapper>
    </Container>
  );
};

export default GroupItem;
