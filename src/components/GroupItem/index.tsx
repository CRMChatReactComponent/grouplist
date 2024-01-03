import { FC, ReactNode, useMemo } from "react";
import { Button, Dropdown, DropdownProps, Flex, Typography } from "antd";
import AvatarAndEmoji, {
  AVATAR_SIZE,
} from "@/components/GroupItem/AvatarAndEmoji";
import { DISABLED_ITEM_INTERACTION_CLASS } from "@/components/GroupItem/const";
import { useActionDropdownProps } from "@/components/GroupItem/hooks/useActionDropdownProps";
import { useGroupItemBackgroundColor } from "@/components/GroupItem/hooks/useGroupItemBackgroundColor";
import { GroupItemTypeEnum } from "@/enums";
import { useIsDark } from "@/hooks/useIsDark";
import { CancelableReturnType } from "@/types";
import {
  FolderExpandedArrow,
  TopRightCornerBoxVertButton,
  Wrapper,
  CenterBox,
  TitleSpan,
  CenterTopBox,
  CenterBottomBox,
  MessageSpan,
} from "./index.styled";
import { GroupItemType } from "./type";
import { MoreOutlined } from "@ant-design/icons";

const { Text } = Typography;

export type GroupItemPropsType = {
  data: GroupItemType;
  isExpanded?: boolean;
  isFocused?: boolean;
  //  右上角 vert 按钮点击后的下拉菜单
  actionDropdownMenu?: DropdownProps["menu"];
  onBeforeDelete?: (data: GroupItemType) => CancelableReturnType;
  onDeleted?: (data: GroupItemType) => void;
  onDataChange?: (data: GroupItemType) => void;
  SlotExtraInformation?: ReactNode;
  SlotTopRightArea?: ReactNode;
  SlotBottomRightArea?: ReactNode;
};

const GroupItem: FC<GroupItemPropsType> = (props: GroupItemPropsType) => {
  const {
    data,
    isExpanded = false,
    isFocused = false,
    actionDropdownMenu,
    onDataChange,
    onBeforeDelete,
    SlotExtraInformation,
    SlotTopRightArea,
    SlotBottomRightArea,
  }: GroupItemPropsType = props;
  const { title, message, backgroundColor, emoji, avatar, readonly } = data;

  const actionDropdownProps = useActionDropdownProps({
    data,
    actionDropdownMenu,
    onBeforeDelete,
    onColorChange(color: string) {
      handleDataValueChange("backgroundColor", color);
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
    <Wrapper
      $bg={bg}
      $bgHover={hoverBg}
      $isHaveMiddleInformation={isHaveMiddleInformation}
      $isDark={isDark}
    >
      <div
        style={{ marginRight: 18 }}
        className={DISABLED_ITEM_INTERACTION_CLASS}
      >
        <AvatarAndEmoji
          avatar={avatar}
          emoji={emoji}
          defaultEmoji={defaultEmoji}
          allowDelete={true}
          disabled={readonly}
          onEmojiChange={(emoji) => handleDataValueChange("emoji", emoji)}
        />
      </div>

      {/*中间区域(包含右上角的 vert*/}
      <CenterBox $space={AVATAR_SIZE + 18}>
        <CenterTopBox $marginTop={isHaveMiddleInformation ? -2 : 0}>
          <TitleSpan>{title}</TitleSpan>

          {/*右上角功能区域*/}
          <div>
            {SlotTopRightArea && SlotTopRightArea}

            <TopRightCornerBoxVertButton>
              <Dropdown {...actionDropdownProps}>
                <Button size={"small"} type={"text"} icon={<MoreOutlined />} />
              </Dropdown>
            </TopRightCornerBoxVertButton>

            {data.type === GroupItemTypeEnum.GROUP && (
              <FolderExpandedArrow $isExpanded={isExpanded} />
            )}
          </div>
        </CenterTopBox>

        {/*额外信息注入*/}
        {SlotExtraInformation && SlotExtraInformation}

        {/*消息*/}
        <CenterBottomBox>
          <MessageSpan>{message}</MessageSpan>

          {/*右下角插槽*/}
          <div className={DISABLED_ITEM_INTERACTION_CLASS}>
            {SlotBottomRightArea && SlotBottomRightArea}
          </div>
        </CenterBottomBox>
      </CenterBox>
    </Wrapper>
  );
};

export default GroupItem;
