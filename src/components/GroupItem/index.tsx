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
  /**
   * 数据
   */
  data: GroupItemType;
  /**
   * 是否展开，
   * 只对 folder 生效
   */
  isExpanded?: boolean;
  /**
   * 是否 focus
   * 只对 user 生效
   */
  isFocused?: boolean;
  /**
   * 是否选中
   */
  isSelected?: boolean;
  /**
   * 是否处于 drop over 状态
   * 只对 folder 生效
   */
  isOnDropOver?: boolean;
  /**
   * 右上角 vert 按钮点击后的下拉菜单
   */
  actionDropdownMenu?: DropdownProps["menu"];
  /**
   * 点击删除之前的回调，返回 false 将会停止删除
   * @param data
   */
  onBeforeDelete?: (data: GroupItemType) => CancelableReturnType;
  /**
   * 删除时的回调
   * @param data
   */
  onDeleted?: (data: GroupItemType) => void;
  /**
   * 数据改变时回调
   * @param data
   */
  onDataChange?: (data: GroupItemType) => void;
  /**
   * 名字和消息中间的插槽
   */
  SlotExtraInformation?: DefaultSlotType;
  /**
   * 头像区域插槽
   */
  SlotAvatarExtra?: DefaultSlotType;
  /**
   * 右侧下拉菜单左侧插槽
   */
  SlotTopRightAreaLeft?: DefaultSlotType;
  /**
   * 右侧下拉菜单右侧插槽
   */
  SlotTopRightAreaRight?: DefaultSlotType;
  /**
   * 右下角插槽
   */
  SlotBottomRightArea?: DefaultSlotType;

  /** hooks */
  /**
   * 头像钩子，在渲染头像之前调用
   * @param data
   * @param avatar
   * @returns
   */
  avatarHook?: (
    data: GroupItemType,
    avatar: GroupItemType["avatar"],
  ) => GroupItemType["avatar"];
};

const GroupItem: FC<GroupItemPropsType> = (props: GroupItemPropsType) => {
  const {
    data,
    isExpanded = false,
    isFocused = false,
    isSelected = false,
    isOnDropOver = false,
    actionDropdownMenu,
    onDataChange,
    onDeleted,
    onBeforeDelete,
    SlotExtraInformation,
    SlotTopRightAreaLeft,
    SlotTopRightAreaRight,
    SlotBottomRightArea,
    SlotAvatarExtra,
    avatarHook,
  }: GroupItemPropsType = props;
  const { title, message, backgroundColor, emoji, avatar, readonly, id } = data;

  const avatarLink = useMemo(() => {
    if (avatarHook) {
      return avatarHook(data, avatar);
    }
    return avatar;
  }, [avatar, avatarHook, data]);

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

  const actionDropdownPropsContextMenu = useActionDropdownProps({
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
        $isOnDropOver={isOnDropOver}
        $isDarkBg={isDarkBgColor}
      >
        <AvatarWrapper className={DISABLED_ITEM_INTERACTION_CLASS}>
          <AvatarAndEmoji
            avatar={avatarLink}
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

        <Dropdown {...actionDropdownPropsContextMenu} trigger={["contextMenu"]}>
          {/*中间区域(包含右上角的 vert*/}
          <CenterBox
            $space={AVATAR_SIZE + 18}
            $gap={isHaveMiddleInformation ? 0 : 8}
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
        </Dropdown>
      </Wrapper>
    </Container>
  );
};

export default GroupItem;
