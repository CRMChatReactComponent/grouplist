import { FC, ReactNode } from "react";
import { Flex, Space, Typography, DropdownProps, Button, Dropdown } from "antd";
import AvatarAndEmoji from "@/components/GroupItem/AvatarAndEmoji";
import { useActionDropdownProps } from "@/components/GroupItem/hooks/useActionDropdownProps";
import { useGroupItemBackgroundColor } from "@/components/GroupItem/hooks/useGroupItemBackgroundColor";
import { CancelableReturnType } from "@/types";
import { GroupItemDataType } from "./type";
import { MoreOutlined } from "@ant-design/icons";
import styled from "styled-components";

const { Text } = Typography;

export type GroupItemPropsType = {
  data: GroupItemDataType;
  //  右上角 vert 按钮点击后的下拉菜单
  actionDropdownMenu?: DropdownProps["menu"];
  onBeforeClick?: (data: GroupItemDataType) => CancelableReturnType;
  onClick?: (data: GroupItemDataType) => void;
  onBeforeDelete?: (data: GroupItemDataType) => CancelableReturnType;
  onDeleted?: (data: GroupItemDataType) => void;
  onDragStart?: (data: GroupItemDataType) => CancelableReturnType;
  onDrop?: (data: GroupItemDataType) => void;
  onDataChange?: (data: GroupItemDataType) => void;
  SlotExtraInformation?: ReactNode;
};

const Wrapper = styled.section<{ $bg: string; $bgHover: string }>`
  padding: 4px 8px;
  background-color: ${(p) => p.$bg};
  width: 100%;
  border-radius: 8px;
  cursor: pointer;
  height: 54px;
  line-height: 1em;
  &:hover {
    background: ${(p) => p.$bgHover};
  }
`;

const GroupItem: FC<GroupItemPropsType> = (props: GroupItemPropsType) => {
  const {
    data,
    actionDropdownMenu,
    onDataChange,
    onBeforeDelete,
    SlotExtraInformation,
  }: GroupItemPropsType = props;
  const { title, message, backgroundColor, emoji, avatar, readonly } = data;

  const { bg, hoverBg } = useGroupItemBackgroundColor(backgroundColor);
  const actionDropdownProps = useActionDropdownProps({
    data,
    actionDropdownMenu,
    onBeforeDelete,
    onColorChange(color: string) {
      handleDataValueChange("backgroundColor", color);
    },
  });

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
    <Wrapper $bg={bg} $bgHover={hoverBg}>
      <Flex style={{ height: "100%", width: "100%" }} align={"center"}>
        <div style={{ marginRight: 18 }}>
          <AvatarAndEmoji
            avatar={avatar}
            emoji={emoji}
            allowDelete={true}
            disabled={readonly}
            onEmojiChange={(emoji) => handleDataValueChange("emoji", emoji)}
          />
        </div>

        {/*标题*/}
        <Flex
          vertical={true}
          justify={"space-between"}
          style={{ height: "100%", width: "100%" }}
        >
          <Flex justify={"space-between"} style={{ width: "100%" }}>
            <Text
              style={{ flex: "1 1 auto" }}
              editable={
                readonly
                  ? false
                  : {
                      onChange: (val) => handleDataValueChange("title", val),
                      triggerType: ["text"],
                    }
              }
              ellipsis={true}
            >
              {title}
            </Text>

            {/*右上角功能区域*/}
            <Space size={12}>
              <div>slot</div>

              <Dropdown {...actionDropdownProps}>
                <Button size={"small"} type={"text"} icon={<MoreOutlined />} />
              </Dropdown>
            </Space>
          </Flex>

          {/*额外信息注入*/}
          {SlotExtraInformation && SlotExtraInformation}

          {/*消息*/}
          <Text ellipsis={true} type={"secondary"} style={{ fontSize: 12 }}>
            {message}
          </Text>
        </Flex>
      </Flex>
    </Wrapper>
  );
};

export default GroupItem;
