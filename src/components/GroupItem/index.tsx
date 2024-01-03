import { FC, ReactNode, useCallback, useMemo } from "react";
import {
  Button,
  Dropdown,
  DropdownProps,
  Flex,
  Space,
  Typography,
  theme,
  ConfigProvider,
} from "antd";
import AvatarAndEmoji, {
  AVATAR_SIZE,
} from "@/components/GroupItem/AvatarAndEmoji";
import { DISABLED_ITEM_INTERACTION_CLASS } from "@/components/GroupItem/const";
import { useActionDropdownProps } from "@/components/GroupItem/hooks/useActionDropdownProps";
import { useGroupItemBackgroundColor } from "@/components/GroupItem/hooks/useGroupItemBackgroundColor";
import { GroupItemTypeEnum } from "@/enums";
import { CancelableReturnType } from "@/types";
import { GroupItemType } from "./type";
import { MoreOutlined } from "@ant-design/icons";
import styled from "styled-components";

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

const TopRightCornerBox = styled.div`
  opacity: 0;
`;

const Arrow = styled.span<{ $isExpanded: boolean }>`
  position: relative;
  display: block;
  width: 12px;
  transform: translateY(${({ $isExpanded }) => ($isExpanded ? -5 : 0)}px);
  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 6px;
    height: 2px;
    background-color: currentColor;
    border-radius: 6px;
    transform: rotate(${({ $isExpanded }) => ($isExpanded ? -45 : 45)}deg)
      translateX(-3px);
  }
  &::after {
    transform: rotate(${({ $isExpanded }) => ($isExpanded ? 45 : -45)}deg)
      translateX(3px);
  }
`;

const Wrapper = styled.section<{
  $bg: string;
  $bgHover: string;
  $isHaveMiddleInformation;
}>`
  padding: 4px 8px;
  background-color: ${(p) => p.$bg};
  width: 100%;
  cursor: pointer;
  height: ${(p) => (p.$isHaveMiddleInformation ? 60 : 42)}px;
  line-height: 1em;
  &:hover {
    background: ${(p) => p.$bgHover};
  }

  &:hover ${TopRightCornerBox} {
    opacity: 1;
  }
`;

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

  const { bg, hoverBg, isDarkBgColor } =
    useGroupItemBackgroundColor(backgroundColor);
  const actionDropdownProps = useActionDropdownProps({
    data,
    actionDropdownMenu,
    onBeforeDelete,
    onColorChange(color: string) {
      handleDataValueChange("backgroundColor", color);
    },
  });

  const isHaveMiddleInformation = useMemo(
    () => !!SlotExtraInformation,
    [SlotExtraInformation],
  );
  const defaultEmoji = useMemo(() => {
    return data.type === GroupItemTypeEnum.GROUP ? "1f4c1" : "1f466";
  }, [data.type]);

  const ThemeProviderWrapper = useCallback(
    (props: { children: ReactNode }) => {
      return (
        <ConfigProvider
          theme={{
            algorithm: isDarkBgColor
              ? theme.darkAlgorithm
              : theme.defaultAlgorithm,
          }}
        >
          {props.children}
        </ConfigProvider>
      );
    },
    [isDarkBgColor],
  );

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
    >
      <Flex style={{ height: "100%" }} align={"center"} justify={"flex-start"}>
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
        <Flex
          vertical={true}
          justify={"space-between"}
          style={{
            height: "100%",
            width: `calc(100% - ${AVATAR_SIZE + 18}px)`,
          }}
        >
          <Flex
            justify={"space-between"}
            align={"center"}
            style={{
              width: "100%",
              marginTop: isHaveMiddleInformation ? -2 : 0,
            }}
          >
            <ThemeProviderWrapper>
              <Text style={{ flex: "1 1 auto", lineHeight: 1 }} ellipsis={true}>
                {title}
              </Text>
            </ThemeProviderWrapper>

            {/*右上角功能区域*/}
            <Space size={8}>
              <Space size={8} className={DISABLED_ITEM_INTERACTION_CLASS}>
                {SlotTopRightArea && SlotTopRightArea}

                <TopRightCornerBox>
                  <Dropdown {...actionDropdownProps}>
                    <div>
                      <ThemeProviderWrapper>
                        <Button
                          size={"small"}
                          type={"text"}
                          icon={<MoreOutlined />}
                        />
                      </ThemeProviderWrapper>
                    </div>
                  </Dropdown>
                </TopRightCornerBox>
              </Space>

              {data.type === GroupItemTypeEnum.GROUP && (
                <ThemeProviderWrapper>
                  <Text type={"secondary"}>
                    <Arrow $isExpanded={isExpanded} />
                  </Text>
                </ThemeProviderWrapper>
              )}
            </Space>
          </Flex>

          {/*额外信息注入*/}
          <ThemeProviderWrapper>
            {SlotExtraInformation && SlotExtraInformation}
          </ThemeProviderWrapper>

          {/*消息*/}
          <ThemeProviderWrapper>
            <Flex
              justify={"space-between"}
              align={"center"}
              style={{ width: "100%" }}
            >
              <Text
                ellipsis={true}
                type={"secondary"}
                style={{
                  fontSize: 12,
                  lineHeight: 1,
                  flex: "1 1 auto",
                  wordWrap: "break-word",
                  //  如果不加这个会导致 ellipsis:true 后出现宽度异常
                  width: 1,
                }}
              >
                {message}
              </Text>

              {/*右下角插槽*/}
              <div className={DISABLED_ITEM_INTERACTION_CLASS}>
                {SlotBottomRightArea && SlotBottomRightArea}
              </div>
            </Flex>
          </ThemeProviderWrapper>
        </Flex>
      </Flex>
    </Wrapper>
  );
};

export default GroupItem;
